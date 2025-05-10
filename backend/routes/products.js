const express = require("express");
const route = express.Router();
const productController = require("../controllers/Products/ProductController");

route.get("/products",productController.fetchData);
// route.post("/addProduct");
// route.update("/updateProduct");
// route.delete("/delproduct");

module.exports = route;