const express = require("express");
const route = express.Router();
const userController = require("../controllers/User/AuthController");
const { userMiddleware } = require("../middleware/tokenVerify");

route.get('/fetchAddress',userMiddleware,userController.showAddress);
route.post('/addAddress',userMiddleware,userController.addAddress);
route.delete('/deleteAddress/:id',userMiddleware,userController.deleteAddress);

module.exports = route;