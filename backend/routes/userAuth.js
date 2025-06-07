const express = require('express');
const route = express.Router();
const userAuthController = require('../controllers/User/AuthController');
const validations = require("../middleware/schemaValidate");

route.post('/otpSent',validations.validateEmail,userAuthController.otpSent);
route.post('/otpVerify',validations.otp,userAuthController.otpVerify);
route.post('/createPass',validations.userCredentials,userAuthController.createPass);
route.post('/login',validations.login,userAuthController.login);
route.post('/forgetPass',userAuthController.forgetPass);
route.post('/changePass',userAuthController.changePass);

module.exports = route;
