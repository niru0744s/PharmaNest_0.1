const express = require('express');
const route = express.Router();
const userProductController = require('../controllers/User/ProductsController');
const middleware = require("../middleware/tokenVerify");

route.get("/fetchWishlist", middleware.userMiddleware, userProductController.showWishlist);
route.post('/addWishlist/:id', middleware.userMiddleware, userProductController.addWishlist);
route.delete('/deleteWishlist/:id', middleware.userMiddleware, userProductController.removeWishlist);

route.get("/fetchCart", middleware.userMiddleware, userProductController.showCart);
route.post("/addCart/:id", middleware.userMiddleware, userProductController.addCart);
route.patch("/updateCart/:id", middleware.userMiddleware, userProductController.editCart);
route.delete("/deleteCart/:id", middleware.userMiddleware, userProductController.deleteCart);

// Legacy order endpoints (deprecated, replaced by /api/v1/user/orders and checkout flow)
// route.get("/fetchOrders", middleware.userMiddleware, userProductController.showOrders);
// route.post("/placeOrder", middleware.userMiddleware, userProductController.placeOrder);
// route.put("/cancelOrder", middleware.userMiddleware, userProductController.cancelOrder);
// route.put("/cancelOrder/:orderId", middleware.userMiddleware, userProductController.cancelOrder);

// Legacy AI endpoint (deprecated, replaced by /api/v1/ai/chat)
// route.post("/chatAi", middleware.userMiddleware, chatController.handleAIChat);
route.post("/syncCart", middleware.userMiddleware, userProductController.syncCart);
route.post("/checkout", middleware.userMiddleware, userProductController.checkout);

// Legacy payment endpoint (deprecated, replaced by /api/v1/payment/create-order and /user/checkout)
// route.post("/create-razorpay-order", middleware.userMiddleware, paymentController.createOrder);
module.exports = route;
