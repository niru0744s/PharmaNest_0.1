const express = require('express');
const route = express.Router();
const userProductController = require('../controllers/User/ProductsController');
const paymentController = require("../controllers/User/paymentController");
const middleware = require("../middleware/tokenVerify");
const chatController = require("../controllers/User/aiChatController");

route.get("/fetchWishlist",middleware.userMiddleware,userProductController.showWishlist);
route.post('/addWishlist/:id',middleware.userMiddleware,userProductController.addWishlist);
route.delete('/deleteWishlist/:id',middleware.userMiddleware,userProductController.removeWishlist);

route.get("/fetchCart",middleware.userMiddleware,userProductController.showCart);
route.post("/addCart/:id",middleware.userMiddleware,userProductController.addCart);
route.patch("/updateCart/:id",middleware.userMiddleware,userProductController.editCart);
route.delete("/deleteCart/:id",middleware.userMiddleware,userProductController.deleteCart);

route.get("/fetchOrders",middleware.userMiddleware,userProductController.showOrders);
route.post("/placeOrder",middleware.userMiddleware,userProductController.placeOrder);
route.put("/cancelOrder",middleware.userMiddleware,userProductController.cancelOrder);
route.put("/cancelOrder/:orderId", middleware.userMiddleware, userProductController.cancelOrder);

route.post("/chatAi",middleware.userMiddleware,chatController.handleAIChat);

route.post("/create-razorpay-order",middleware.userMiddleware,paymentController.createOrder);
module.exports = route;