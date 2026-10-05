const Product = require("../modules/Products");
const { embedQuery } = require("../utils/embeddings");

/**
 * Perform vector search using MongoDB Atlas Vector Search
 * @param {string} query User natural language query
 * @param {number} limit Number of results to return
 * @param {object} [filter] Optional pre-filter (e.g. { prescriptionRequired: false })
 */
async function vectorSearchProducts(query, limit = 8, filter) {
  const queryVector = await embedQuery(query);
  const pipeline = [
    {
      $vectorSearch: {
        index: "product_embed_index",
        path: "embedding",
        queryVector,
        exact: true,
        limit,
        ...(filter && { filter })
      }
    },
    {
      $project: {
        name: 1,
        brand: 1,
        genericName: 1,
        form: 1,
        strength: 1,
        category: 1,
        description: 1,
        uses: 1,
        keywords: 1,
        prescriptionRequired: 1,
        price: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ];

  return Product.aggregate(pipeline);
}

module.exports = { vectorSearchProducts };
