const Chat = require("../../modules/Chat");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handleAIChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userMessage } = req.body;

    const llmRes = await fetch(process.env.AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LLM7_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          { role: "system", content: "You are a helpful medicine and Health care related recommender AI , just tell the medicines name and healthcare related products name ." },
          { role: "user", content: userMessage }
        ]
      }),
    });
    if (!llmRes.ok) throw new Error("LLM API failed");
    const contentType = llmRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const html = await llmRes.text();
      return res.status(500).json({ success: false, message: "LLM7 returned invalid response" });
    }

    const data = await llmRes.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, no reply generated.";

    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: [
            { role: "user", content: userMessage },
            { role: "assistant", content: aiMessage },
          ],
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      aiReply: aiMessage
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "AI service failed. Please try again later.",
    });
  }
};
