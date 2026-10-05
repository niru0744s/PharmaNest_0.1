const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Product = require("../modules/Products");
const { invalidateProductReadCaches } = require("../utils/cacheInvalidation");

async function runUpdate() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        family: 4
    });

    const patchPath = path.join(__dirname, "products-patch.json");
    const patches = JSON.parse(fs.readFileSync(patchPath, "utf8"));

    console.log(`Loaded ${patches.length} product patches.`);

    const ops = patches.map(({ _id, genericName, uses, keywords, prescriptionRequired }) => ({
        updateOne: {
            filter: { _id },
            update: { $set: { genericName, uses, keywords, prescriptionRequired } }
        }
    }));

    const res = await Product.bulkWrite(ops);
    console.log(res.matchedCount, "matched,", res.modifiedCount, "modified");

    try {
        await invalidateProductReadCaches();
        console.log("Product caches invalidated successfully.");
    } catch (cacheErr) {
        console.warn("Cache invalidation skipped or error:", cacheErr.message);
    }

    await mongoose.disconnect();
    console.log("Database update completed.");
}

runUpdate().catch(err => {
    console.error("Update failed:", err);
    process.exit(1);
});
