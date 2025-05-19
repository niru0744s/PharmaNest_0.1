const express = require("express");
const route = express.Router();
const productController = require("../controllers/Products/ProductController");
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage})
const middleware = require("../middleware/tokenVerify.js");
const hostController = require("../controllers/host/hostController");
const { hostMiddleware } = require("../middleware/tokenVerify");

route.get("/products",productController.fetchData);
route.post("/addProduct",hostMiddleware, upload.single("imageUrl"),productController.addProduct);
route.get('/showProducts',hostMiddleware,hostController.showProducts);
route.patch("/updateProduct" , hostMiddleware ,upload.single("imageUrl"),productController.updateproduct);
route.delete("/deleteProduct",hostMiddleware,productController.deleteProduct);

module.exports = route;