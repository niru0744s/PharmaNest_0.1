const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { vectorSearchProducts } = require("../services/vectorSearch");

(async () => {
  console.log("Connecting to MongoDB for Vector Search Smoke Test...");
  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    family: 4
  });

  const testQueries = [
    "severe acidity and burning stomach",
    "paracetmol",
    "pet kharab aur dast lag gayi hai",
    "buk jala korche"
  ];

  for (const q of testQueries) {
    console.log(`\n========================================`);
    console.log(`Query: "${q}"`);
    console.log(`========================================`);
    try {
      const res = await vectorSearchProducts(q, 5);
      if (res.length === 0) {
        console.log("  No vector results returned.");
      } else {
        res.forEach((r, idx) => {
          const score = typeof r.score === 'number' ? r.score.toFixed(3) : 'N/A';
          console.log(`  [#${idx + 1}] Score: ${score} | ${r.name} (${r.brand}) - Generic: ${r.genericName || 'N/A'}`);
          if (r.uses && r.uses.length) console.log(`       Uses: ${r.uses.slice(0, 3).join(', ')}`);
        });
      }
    } catch (err) {
      console.error(`  Error running query "${q}":`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("\nSmoke test completed.");
})().catch(err => {
  console.error("Smoke test failed:", err);
  process.exit(1);
});
