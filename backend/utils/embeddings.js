const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;

// Vectors smaller than 3072 dims should be normalized
function normalize(v) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return norm === 0 ? v : v.map((x) => x / norm);
}

async function embedTexts(texts, taskType, retries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await ai.models.embedContent({
        model: MODEL,
        contents: texts,
        config: { taskType, outputDimensionality: DIMENSIONS },
      });
      return res.embeddings.map((e) => normalize(e.values));
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

const embedQuery = async (q) => (await embedTexts([q], "RETRIEVAL_QUERY"))[0];

module.exports = { embedTexts, embedQuery, DIMENSIONS };
