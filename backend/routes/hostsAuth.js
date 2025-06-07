const express = require("express");
const route = express.Router();
const hostController = require("../controllers/host/hostController");
const { hostMiddleware } = require("../middleware/tokenVerify");
const validations = require("../middleware/schemaValidate");

route.post('/otpSent',validations.validateEmail,hostController.otpSent);
route.post('/otpVerify',validations.otp,hostController.otpVerify);
route.post('/createPass',validations.hostCredentials,hostController.createPass);
route.post('/login',validations.login,hostController.login);

module.exports = route;