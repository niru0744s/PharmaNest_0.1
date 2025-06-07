const express = require("express");
const route = express.Router();
const userController = require("../controllers/User/AuthController");
const { userMiddleware } = require("../middleware/tokenVerify");
const validations = require("../middleware/schemaValidate");

route.get('/fetchAddress',userMiddleware,userController.showAddress);
route.post('/addAddress',userMiddleware,validations.address,userController.addAddress);
route.delete('/deleteAddress/:id',userMiddleware,userController.deleteAddress);

module.exports = route;