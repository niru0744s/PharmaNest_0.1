const Chat = require("../modules/Chat");
const Product = require("../modules/Products");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.getAIAdvice = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = req.user._id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // 1. Fetch products for context
        const products = await Product.find({}).limit(10).select('name category price brand');
        const productContext = products.map(p => `${p.name} (${p.category}) by ${p.brand} - ₹${p.price}`).join(', ');

        // 2. Prepare System Prompt
        const systemPrompt = `You are the Pharmanest AI Advisor, a professional, empathetic, and knowledgeable assistant for a premium online pharmacy.
        
        Available products context: ${productContext}
        
        CRITICAL RULES:
        - ALWAYS include a disclaimer: "Please consult with a qualified healthcare professional before taking any medication."
        - Be concise and polite.
        - If a user asks for something outside of healthcare/pharmacy, politely redirect them.
        - Use Markdown for formatting.`;

        // 3. Prepare Messages for LLM7 (OpenAI compatible)
        const messages = [
            { role: "system", content: systemPrompt },
            ...(history || []).map(h => ({
                role: h.role === "user" ? "user" : "assistant",
                content: h.content
            })),
            { role: "user", content: message }
        ];

        // 4. Call LLM7 API
        const response = await fetch(process.env.AI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.LLM7_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3", // or whichever model llm7 uses
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`AI API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request.";

        // 5. Store in DB
        await Chat.findOneAndUpdate(
            { userId },
            {
                $push: {
                    messages: [
                        { role: "user", content: message },
                        { role: "assistant", content: aiReply },
                    ],
                },
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            reply: aiReply
        });

    } catch (error) {
        console.error("AI Advisor Error:", error);
        res.status(500).json({
            success: false,
            message: "I'm having trouble connecting to my knowledge base. Please try again later."
        });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findOne({ userId });

        res.status(200).json({
            success: true,
            history: chat ? chat.messages : []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch chat history" });
    }
};
