const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Product = require("../modules/Products");
const { embedTexts } = require("../utils/embeddings");

const list = (a) => (Array.isArray(a) && a.length ? a.join(", ") : "");

function buildEmbeddingText(p) {
  return [
    `${p.name}${p.brand ? ` (${p.brand})` : ""}${p.genericName ? `, generic name: ${p.genericName}` : ""}.`,
    [p.form, p.strength].filter(Boolean).join(" "),
    p.description,
    list(p.uses) && `Used for: ${list(p.uses)}.`,
    list(p.keywords) && `Also known as: ${list(p.keywords)}.`,
    p.category && `Category: ${p.category}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

(async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    family: 4
  });

  const products = await Product.find({}).lean();
  console.log(`Embedding ${products.length} products...`);
  console.log("Sample text for product 0:\n", buildEmbeddingText(products[0]), "\n");

  const CHUNK = 20;
  for (let i = 0; i < products.length; i += CHUNK) {
    const chunk = products.slice(i, i + CHUNK);
    const texts = chunk.map(buildEmbeddingText);
    const vectors = await embedTexts(texts, "RETRIEVAL_DOCUMENT");

    const bulkOps = chunk.map((p, idx) => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { embedding: vectors[idx] } }
      }
    }));

    const res = await Product.bulkWrite(bulkOps);
    console.log(`Done ${Math.min(i + CHUNK, products.length)}/${products.length} (matched: ${res.matchedCount}, modified: ${res.modifiedCount})`);
  }

  await mongoose.disconnect();
  console.log("Finished embedding and saving all products to DB successfully!");
})().catch(err => {
  console.error("Embedding generation failed:", err);
  process.exit(1);
});
