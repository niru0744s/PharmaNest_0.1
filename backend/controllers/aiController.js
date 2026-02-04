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

        // 1. Fetch relevant products using text search
        let products = await Product.find(
            { $text: { $search: message } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(8)
            .select('name category price brand description');

        // Fallback: If no relevant products found, fetch some popular ones
        if (products.length === 0) {
            products = await Product.find({})
                .sort({ soldQuantity: -1 })
                .limit(5)
                .select('name category price brand description');
        }

        const productContext = products.map(p =>
            `${p.name} (${p.category}) by ${p.brand} - ₹${p.price}. Description: ${p.description?.substring(0, 100)}...`
        ).join('\n');

        // 2. Prepare System Prompt
        const systemPrompt = `You are the Pharmanest AI Advisor, a professional, empathetic, and knowledgeable assistant for a premium online pharmacy.
        
        CRITICAL CONTEXT: Below are the products from our pharmacy that are most RELEVANT to the user's current query. 
        Always try to recommend or mention these specific products if they fit the user's needs.
        
        RELEVANT PRODUCTS:
        ${productContext}
        
        CRITICAL RULES:
        - ALWAYS include a disclaimer: "Please consult with a qualified healthcare professional before taking any medication."
        - Be concise and polite.
        - If a user asks for something outside of healthcare/pharmacy, politely redirect them.
        - Use Markdown for formatting.
        - If no product specifically matches, provide general advice and mention we have a wide range of products.`;

        // 3. Prepare Messages for AI (OpenAI compatible)
        const messages = [
            { role: "system", content: systemPrompt },
            ...(history || []).map(h => ({
                role: h.role === "user" ? "user" : "assistant",
                content: h.content
            })),
            { role: "user", content: message }
        ];

        // 4. Call AI API
        const response = await fetch(process.env.AI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.LLM7_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3",
                messages: messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AI API responded with status: ${response.status}. Details: ${errorText}`);
        }

        const data = await response.json();

        // Log keys for debugging if it fails again
        if (!data.choices || data.choices.length === 0) {
            console.error("AI Response Missing Choices:", data);
            throw new Error("AI provider returned an empty response. Check API key or model availability.");
        }

        const aiReply = data.choices[0].message?.content || "I'm sorry, I couldn't process your request.";

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
