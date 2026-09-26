const Chat = require("../modules/Chat");
const Product = require("../modules/Products");
const crypto = require("crypto");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { getCache, setCache } = require("../utils/cache");
const { recordAiLatency, getAiLatencySummary } = require("../utils/latencyMetrics");

const AI_MODEL = "llama3";
const AI_PROMPT_VERSION = "v2";
const AI_CACHE_TTL_SECONDS = 600;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_CONTENT_CHARS = 300;
const MAX_MESSAGE_CHARS = 500;
const MAX_PRODUCT_DESCRIPTION_CHARS = 80;
const MAX_CONTEXT_PRODUCTS = 5;
const CHAT_HISTORY_CAP = 120;
const AI_MAX_TOKENS = Number(process.env.AI_MAX_TOKENS) > 0 ? Number(process.env.AI_MAX_TOKENS) : 220;
const AI_TEMPERATURE = Number(process.env.AI_TEMPERATURE);
const hasValidTemperature = Number.isFinite(AI_TEMPERATURE);

const normalizeText = (value = "") =>
    String(value).replace(/\s+/g, " ").trim();

const sanitizeHistory = (history) => {
    if (!Array.isArray(history)) return [];

    return history
        .filter((item) => item && typeof item.content === "string")
        .map((item) => ({
            role: item.role === "user" ? "user" : "assistant",
            content: normalizeText(item.content).slice(0, MAX_HISTORY_CONTENT_CHARS)
        }))
        .filter((item) => item.content.length > 0)
        .slice(-MAX_HISTORY_TURNS);
};

const buildAiCacheKey = ({ message, history }) => {
    const payload = JSON.stringify({
        promptVersion: AI_PROMPT_VERSION,
        model: AI_MODEL,
        message: normalizeText(message).toLowerCase(),
        history
    });
    const hash = crypto.createHash("sha256").update(payload).digest("hex");
    return `ai:chat:reply:${AI_PROMPT_VERSION}:${hash}`;
};

const persistChatMessages = async ({ userId, message, aiReply }) => {
    await Chat.findOneAndUpdate(
        { userId },
        {
            $push: {
                messages: {
                    $each: [
                        { role: "user", content: message },
                        { role: "assistant", content: aiReply }
                    ],
                    $slice: -CHAT_HISTORY_CAP
                }
            }
        },
        { upsert: true, new: false }
    );
};

const buildProductContext = async (message) => {
    const productQueryStart = Date.now();
    let products = await Product.find(
        { $text: { $search: message } },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .limit(8)
        .select("name category price brand description")
        .lean();

    if (products.length === 0) {
        products = await Product.find({})
            .sort({ soldQuantity: -1 })
            .limit(MAX_CONTEXT_PRODUCTS)
            .select("name category price brand description")
            .lean();
    }

    const productContext = products
        .slice(0, MAX_CONTEXT_PRODUCTS)
        .map((p) =>
            `${p.name} (${p.category}) by ${p.brand} - ₹${p.price}. Description: ${(p.description || "").substring(0, MAX_PRODUCT_DESCRIPTION_CHARS)}...`
        )
        .join("\n");

    return {
        productContext,
        productQueryMs: Date.now() - productQueryStart
    };
};

const buildSystemPrompt = (productContext) => `You are the Pharmanest AI Advisor, a professional, empathetic, and knowledgeable assistant for a premium online pharmacy.

CRITICAL CONTEXT: Below are the products from our pharmacy that are most RELEVANT to the user's current query.
Always prioritize these products if they fit the user's needs.

RELEVANT PRODUCTS:
${productContext}

CRITICAL RULES:
- ALWAYS include this disclaimer exactly once: "Please consult with a qualified healthcare professional before taking any medication."
- Keep the response concise (maximum 5 bullet points or 120 words).
- If a user asks for something outside healthcare/pharmacy, politely redirect them.
- Use Markdown formatting.
- If no product specifically matches, provide general advice and mention we have a wide range of products.`;

const buildMessages = ({ systemPrompt, history, message }) => ([
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.content
    })),
    { role: "user", content: normalizeText(message).slice(0, MAX_MESSAGE_CHARS) }
]);

const buildProviderPayload = ({ messages, stream }) => {
    const payload = {
        model: AI_MODEL,
        messages,
        max_tokens: AI_MAX_TOKENS,
        stream: Boolean(stream)
    };

    if (hasValidTemperature) {
        payload.temperature = AI_TEMPERATURE;
    }

    return payload;
};

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.LLM7_API_KEY}`
});

const parseStreamChunk = (line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return { done: false, content: "" };
    const payloadRaw = trimmed.slice(5).trim();
    if (!payloadRaw) return { done: false, content: "" };
    if (payloadRaw === "[DONE]") return { done: true, content: "" };

    try {
        const payload = JSON.parse(payloadRaw);
        const content =
            payload?.choices?.[0]?.delta?.content ||
            payload?.choices?.[0]?.message?.content ||
            "";
        return { done: false, content };
    } catch (_error) {
        return { done: false, content: "" };
    }
};

const readStreamedCompletion = async ({ response, onToken }) => {
    let buffered = "";
    let fullReply = "";
    const applyChunk = (incoming) => {
        if (!incoming) return "";

        // Some providers emit cumulative snapshots instead of pure token deltas.
        if (incoming.startsWith(fullReply)) {
            const incremental = incoming.slice(fullReply.length);
            fullReply = incoming;
            return incremental;
        }

        // Guard against duplicate old chunks.
        if (fullReply.endsWith(incoming)) {
            return "";
        }

        fullReply += incoming;
        return incoming;
    };

    for await (const chunk of response.body) {
        buffered += chunk.toString("utf8");
        const lines = buffered.split("\n");
        buffered = lines.pop() || "";

        for (const line of lines) {
            const parsed = parseStreamChunk(line);
            if (parsed.done) {
                return fullReply.trim();
            }
            if (parsed.content) {
                const incremental = applyChunk(parsed.content);
                if (incremental && onToken) onToken(incremental);
            }
        }
    }

    if (buffered) {
        const parsed = parseStreamChunk(buffered);
        if (parsed.content) {
            const incremental = applyChunk(parsed.content);
            if (incremental && onToken) onToken(incremental);
        }
    }

    return fullReply.trim();
};

const callAiProvider = async ({ messages, stream = false, onToken }) => {
    const response = await fetch(process.env.AI_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(buildProviderPayload({ messages, stream }))
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API responded with status: ${response.status}. Details: ${errorText}`);
    }

    if (stream) {
        const reply = await readStreamedCompletion({ response, onToken });
        if (!reply) {
            throw new Error("AI provider returned an empty streamed response.");
        }
        return reply;
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
        throw new Error("AI provider returned an empty response. Check API key or model availability.");
    }
    return data.choices[0].message?.content || "I'm sorry, I couldn't process your request.";
};

exports.getAIAdvice = async (req, res) => {
    const requestStart = Date.now();
    let aiCallStart = 0;
    let aiCallMs = 0;
    let productQueryMs = 0;
    let chatSaveMs = 0;
    let cacheLookupMs = 0;
    let cacheHit = false;

    try {
        const body = req.body || {};
        const message = body.message;
        const history = body.history;
        const userId = req.user._id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const normalizedHistory = sanitizeHistory(history);
        const cacheKey = buildAiCacheKey({ message, history: normalizedHistory });

        const cacheLookupStart = Date.now();
        const cachedPayload = await getCache(cacheKey);
        cacheLookupMs = Date.now() - cacheLookupStart;

        let aiReply;
        if (cachedPayload && typeof cachedPayload.reply === "string" && cachedPayload.reply.trim()) {
            cacheHit = true;
            aiReply = cachedPayload.reply;
        } else {
            const { productContext, productQueryMs: productMs } = await buildProductContext(message);
            productQueryMs = productMs;
            const systemPrompt = buildSystemPrompt(productContext);
            const messages = buildMessages({
                systemPrompt,
                history: normalizedHistory,
                message
            });

            aiCallStart = Date.now();
            aiReply = await callAiProvider({ messages, stream: false });
            aiCallMs = Date.now() - aiCallStart;

            await setCache(cacheKey, { reply: aiReply }, AI_CACHE_TTL_SECONDS);
        }

        const chatSaveStart = Date.now();
        await persistChatMessages({ userId, message: normalizeText(message), aiReply });
        chatSaveMs = Date.now() - chatSaveStart;

        const totalMs = Date.now() - requestStart;
        recordAiLatency({
            totalMs,
            aiCallMs,
            productQueryMs,
            chatSaveMs,
            cacheLookupMs,
            firstTokenMs: 0,
            cacheHit,
            success: true
        });
        console.info("[AI_LATENCY]", JSON.stringify({
            totalMs,
            aiCallMs,
            productQueryMs,
            chatSaveMs,
            cacheLookupMs,
            cacheHit,
            messageLength: normalizeText(message).length,
            historyCount: normalizedHistory.length
        }));

        res.status(200).json({
            success: true,
            reply: aiReply
        });
    } catch (error) {
        const totalMs = Date.now() - requestStart;
        const safeAiCallMs = aiCallMs || (aiCallStart ? Date.now() - aiCallStart : 0);
        recordAiLatency({
            totalMs,
            aiCallMs: safeAiCallMs,
            productQueryMs,
            chatSaveMs,
            cacheLookupMs,
            firstTokenMs: 0,
            cacheHit,
            success: false
        });
        console.error("[AI_LATENCY_ERROR]", JSON.stringify({
            totalMs,
            aiCallMs: safeAiCallMs,
            productQueryMs,
            chatSaveMs,
            cacheLookupMs,
            cacheHit,
            error: error.message
        }));
        console.error("AI Advisor Error:", error);
        res.status(500).json({
            success: false,
            message: "I'm having trouble connecting to my knowledge base. Please try again later."
        });
    }
};

exports.getAIAdviceStream = async (req, res) => {
    const requestStart = Date.now();
    let aiCallStart = 0;
    let aiCallMs = 0;
    let productQueryMs = 0;
    let chatSaveMs = 0;
    let cacheLookupMs = 0;
    let firstTokenMs = 0;
    let cacheHit = false;
    let firstTokenCaptured = false;

    const sendEvent = (event, payload) => {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    try {
        const body = req.body || {};
        const message = body.message;
        const history = body.history;
        const userId = req.user._id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders?.();

        const normalizedHistory = sanitizeHistory(history);
        const cacheKey = buildAiCacheKey({ message, history: normalizedHistory });

        const cacheLookupStart = Date.now();
        const cachedPayload = await getCache(cacheKey);
        cacheLookupMs = Date.now() - cacheLookupStart;

        let aiReply = "";
        if (cachedPayload && typeof cachedPayload.reply === "string" && cachedPayload.reply.trim()) {
            cacheHit = true;
            aiReply = cachedPayload.reply;
            firstTokenMs = Date.now() - requestStart;
            sendEvent("meta", { cached: true });
            sendEvent("chunk", { text: aiReply });
        } else {
            const { productContext, productQueryMs: productMs } = await buildProductContext(message);
            productQueryMs = productMs;
            const systemPrompt = buildSystemPrompt(productContext);
            const messages = buildMessages({
                systemPrompt,
                history: normalizedHistory,
                message
            });

            sendEvent("meta", { cached: false });
            aiCallStart = Date.now();
            aiReply = await callAiProvider({
                messages,
                stream: true,
                onToken: (token) => {
                    if (!firstTokenCaptured) {
                        firstTokenCaptured = true;
                        firstTokenMs = Date.now() - requestStart;
                    }
                    sendEvent("chunk", { text: token });
                }
            });
            aiCallMs = Date.now() - aiCallStart;

            await setCache(cacheKey, { reply: aiReply }, AI_CACHE_TTL_SECONDS);
        }

        const chatSaveStart = Date.now();
        await persistChatMessages({ userId, message: normalizeText(message), aiReply });
        chatSaveMs = Date.now() - chatSaveStart;

        const totalMs = Date.now() - requestStart;
        recordAiLatency({
            totalMs,
            aiCallMs,
            productQueryMs,
            chatSaveMs,
            cacheLookupMs,
            firstTokenMs,
            cacheHit,
            success: true
        });

        sendEvent("done", { reply: aiReply });
        res.end();
    } catch (error) {
        const totalMs = Date.now() - requestStart;
        const safeAiCallMs = aiCallMs || (aiCallStart ? Date.now() - aiCallStart : 0);
        recordAiLatency({
            totalMs,
            aiCallMs: safeAiCallMs,
            productQueryMs,
            chatSaveMs,
            cacheLookupMs,
            firstTokenMs,
            cacheHit,
            success: false
        });
        console.error("[AI_LATENCY_ERROR]", JSON.stringify({
            totalMs,
            aiCallMs: safeAiCallMs,
            productQueryMs,
            chatSaveMs,
            cacheLookupMs,
            firstTokenMs,
            cacheHit,
            error: error.message
        }));
        console.error("AI Advisor Stream Error:", error);

        if (res.headersSent) {
            sendEvent("error", { message: "I'm having trouble connecting to my knowledge base. Please try again later." });
            return res.end();
        }

        return res.status(500).json({
            success: false,
            message: "I'm having trouble connecting to my knowledge base. Please try again later."
        });
    }
};

exports.getAILatencyStats = async (req, res) => {
    const metrics = getAiLatencySummary();
    res.status(200).json({
        success: true,
        metrics
    });
};

exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findOne({ userId }).lean();

        res.status(200).json({
            success: true,
            history: chat ? chat.messages : []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch chat history" });
    }
};
