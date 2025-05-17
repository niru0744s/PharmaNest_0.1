const express = require('express');
const route = express.Router();
const userProductController = require('../controllers/User/ProductsController');
const middleware = require("../middleware/tokenVerify");

route.get("/fetchWishlist",middleware.userMiddleware,userProductController.showWishlist);
route.post('/addWishlist/:id',middleware.userMiddleware,userProductController.addWishlist);
route.delete('/deleteWishlist/:id',middleware.userMiddleware,userProductController.removeWishlist);

route.get("/fetchCart",middleware.userMiddleware,userProductController.showCart);
route.post("/addCart/:id",middleware.userMiddleware,userProductController.addCart);
route.patch("/updateCart",middleware.userMiddleware,userProductController.editCart);
route.delete("/deleteCart",middleware.userMiddleware,userProductController.deleteCart);

route.get("/fetchPurchased",middleware.userMiddleware,userProductController.showOrders);
route.post("/placeOrder",middleware.userMiddleware,userProductController.placeOrder);
route.put("/cancelOrder",middleware.userMiddleware,userProductController.cancelOrder);

module.exports = route;