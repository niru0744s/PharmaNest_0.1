const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Determine env and paths
const rootDir = path.resolve(__dirname, '..');
const envPath = fs.existsSync(path.join(__dirname, '../.env')) 
    ? path.join(__dirname, '../.env') 
    : path.join(__dirname, '../backend/.env');

require('dotenv').config({ path: envPath });

// Load test cases
let casesPath = path.join(__dirname, '../tests/retrieval-cases.json');
if (!fs.existsSync(casesPath)) {
    casesPath = path.join(__dirname, '../backend/tests/retrieval-cases.json');
}

const testCases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));

// Load Product Model
let Product;
try {
    Product = require('../modules/Products');
} catch (e) {
    Product = require('../backend/modules/Products');
}

/**
 * EXACT retrieval function from backend/controllers/aiController.js (lines 68-75)
 * Read-only text search with limit 8 and textScore sorting.
 */
async function retrieveProducts(message) {
    const products = await Product.find(
        { $text: { $search: message } },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .limit(8)
        .select("name category price brand description")
        .lean();

    return products;
}

async function runEvaluation() {
    console.log("Connecting to MongoDB in READ-ONLY mode...");
    await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        family: 4
    });

    console.log(`Connected successfully. Running ${testCases.length} evaluation queries...\n`);

    const results = [];
    const groupStats = {};

    for (const testCase of testCases) {
        const { id, group, query, expectedProductIds, expectedProductNames } = testCase;

        if (!groupStats[group]) {
            groupStats[group] = {
                total: 0,
                hits: 0,
                zeroResults: 0,
                ranks: [],
                reciprocalRanks: []
            };
        }

        groupStats[group].total += 1;

        let retrieved = [];
        try {
            retrieved = await retrieveProducts(query);
        } catch (err) {
            console.error(`Error querying: "${query}":`, err.message);
        }

        const retrievedIds = retrieved.map(p => p._id.toString());
        const isZeroResult = retrieved.length === 0;
        if (isZeroResult) {
            groupStats[group].zeroResults += 1;
        }

        // Find rank of first matching expected product (1-indexed)
        let firstHitRank = null;
        let matchedProduct = null;

        for (let i = 0; i < retrieved.length; i++) {
            const prod = retrieved[i];
            const pId = prod._id.toString();
            if (expectedProductIds.includes(pId)) {
                firstHitRank = i + 1;
                matchedProduct = prod;
                break;
            }
        }

        const isHit = firstHitRank !== null;
        if (isHit) {
            groupStats[group].hits += 1;
            groupStats[group].ranks.push(firstHitRank);
            groupStats[group].reciprocalRanks.push(1 / firstHitRank);
        } else {
            groupStats[group].reciprocalRanks.push(0);
        }

        results.push({
            id,
            group,
            query,
            expectedProductIds,
            expectedProductNames,
            retrievedCount: retrieved.length,
            isHit,
            firstHitRank,
            matchedProduct: matchedProduct ? `${matchedProduct.name} (${matchedProduct.brand})` : null,
            retrievedProducts: retrieved.map(p => ({
                id: p._id.toString(),
                name: p.name,
                brand: p.brand
            }))
        });
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.\n");

    // Overall summary calculations
    const totalQueries = results.length;
    const totalHits = results.filter(r => r.isHit).length;
    const totalZeroResults = results.filter(r => r.retrievedCount === 0).length;
    const hitRanks = results.filter(r => r.isHit).map(r => r.firstHitRank);
    const avgRankOverall = hitRanks.length > 0 
        ? (hitRanks.reduce((a, b) => a + b, 0) / hitRanks.length).toFixed(2) 
        : 'N/A';
    const mrrOverall = (results.reduce((acc, r) => acc + (r.isHit ? 1 / r.firstHitRank : 0), 0) / totalQueries).toFixed(3);

    console.log("==========================================================================");
    console.log("                  MONGODB $TEXT SEARCH RETRIEVAL EVALUATION                ");
    console.log("==========================================================================");
    console.log(`Total Queries:         ${totalQueries}`);
    console.log(`Overall Hit@8:         ${totalHits}/${totalQueries} (${((totalHits / totalQueries) * 100).toFixed(1)}%)`);
    console.log(`Zero-Result Queries:   ${totalZeroResults}/${totalQueries} (${((totalZeroResults / totalQueries) * 100).toFixed(1)}%)`);
    console.log(`Avg Rank (First Hit):  ${avgRankOverall} (out of 8)`);
    console.log(`Mean Reciprocal Rank:  ${mrrOverall}`);
    console.log("==========================================================================\n");

    // Group-level summary table
    console.log("---------------------------------------------------------------------------------------------------------");
    console.log(
        "Group".padEnd(30) +
        "Queries".padEnd(10) +
        "Hit@8".padEnd(14) +
        "Zero-Res".padEnd(12) +
        "Avg Rank".padEnd(12) +
        "MRR"
    );
    console.log("---------------------------------------------------------------------------------------------------------");

    for (const [groupName, stats] of Object.entries(groupStats)) {
        const hitPct = ((stats.hits / stats.total) * 100).toFixed(1) + "%";
        const zeroPct = ((stats.zeroResults / stats.total) * 100).toFixed(1) + "%";
        const avgR = stats.ranks.length > 0 
            ? (stats.ranks.reduce((a, b) => a + b, 0) / stats.ranks.length).toFixed(2)
            : 'N/A';
        const mrr = (stats.reciprocalRanks.reduce((a, b) => a + b, 0) / stats.total).toFixed(3);

        console.log(
            groupName.padEnd(30) +
            `${stats.total}`.padEnd(10) +
            `${stats.hits}/${stats.total} (${hitPct})`.padEnd(14) +
            `${stats.zeroResults} (${zeroPct})`.padEnd(12) +
            `${avgR}`.padEnd(12) +
            `${mrr}`
        );
    }
    console.log("---------------------------------------------------------------------------------------------------------\n");

    // Failed queries
    const failedQueries = results.filter(r => !r.isHit);
    console.log(`==========================================================================`);
    console.log(`FAILED QUERIES (Hit@8 = 0) : ${failedQueries.length} of ${totalQueries}`);
    console.log(`==========================================================================\n`);

    failedQueries.forEach((fq, idx) => {
        console.log(`[${idx + 1}] ID: ${fq.id} | Group: ${fq.group}`);
        console.log(`    Query: "${fq.query}"`);
        console.log(`    Expected: ${fq.expectedProductNames.join(" OR ")}`);
        if (fq.retrievedCount === 0) {
            console.log(`    Returned: [ZERO RESULTS RETURNED]`);
        } else {
            const returnedNames = fq.retrievedProducts.map(p => `${p.name} (${p.brand})`).join(", ");
            console.log(`    Returned (${fq.retrievedCount}): ${returnedNames}`);
        }
        console.log("");
    });

    // Also output a structured JSON report for record keeping
    const reportPath = path.join(__dirname, 'retrieval-eval-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        summary: {
            totalQueries,
            totalHits,
            hitRate: `${((totalHits / totalQueries) * 100).toFixed(1)}%`,
            totalZeroResults,
            zeroResultRate: `${((totalZeroResults / totalQueries) * 100).toFixed(1)}%`,
            avgRankOverall,
            mrrOverall
        },
        groupStats,
        failedQueries
    }, null, 2));

    console.log(`Report written to ${reportPath}`);
}

runEvaluation().catch(console.error);
