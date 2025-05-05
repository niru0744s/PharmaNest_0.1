const express = require("express");
const route = express.Router();
const hostController = require("../controllers/host/hostController");

route.post('/otpSent',hostController.otpSent);
route.post('/otpVerify',hostController.otpVerify);
route.post('/createPass',hostController.createPass);
route.post('/login',hostController.login);

module.exports = route;