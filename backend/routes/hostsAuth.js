const express = require("express");
const route = express.Router();
const hostController = require("../controllers/host/hostController");
const { hostMiddleware } = require("../middleware/tokenVerify");
const validations = require("../middleware/schemaValidate");

// route.post('/otpSent', validations.validateEmail, hostController.otpSent);
route.post('/otpVerify', validations.otp, hostController.otpVerify);
// route.post('/createPass', validations.hostCredentials, hostController.createPass);
route.post('/login', validations.login, hostController.login);
route.post('/register', validations.register, hostController.register);
route.post('/forgetPass', hostController.forgetPass);
route.post('/changePass', validations.changePass, hostController.changePass);
route.get('/profile', hostMiddleware, hostController.getProfile);

module.exports = route;
