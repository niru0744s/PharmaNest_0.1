const express = require("express");
const route = express.Router();
const productController = require("../controllers/Products/ProductController");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage })
const middleware = require("../middleware/tokenVerify.js");
const validations = require("../middleware/schemaValidate");
const hostController = require("../controllers/host/hostController");
const searchController = require("../controllers/Products/SearchController");
const { hostMiddleware } = require("../middleware/tokenVerify");

route.get("/search", searchController.searchProducts);
route.get("/products", productController.fetchData);
route.get("/show-product/:id", productController.showProduct);
route.post("/addProduct", hostMiddleware, upload.single("imageUrl"), validations.product, productController.addProduct);
route.get('/showProducts', hostMiddleware, hostController.showProducts);
route.patch("/updateProduct", hostMiddleware, upload.single("imageUrl"), productController.updateproduct);
route.patch("/updateBulkPrices", hostMiddleware, productController.updateBulkPrices);
route.delete("/deleteProduct", hostMiddleware, productController.deleteProduct);

module.exports = route;