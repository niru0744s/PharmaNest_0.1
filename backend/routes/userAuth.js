const express = require('express');
const route = express.Router();
const userAuthController = require('../controllers/User/AuthController');

route.post('/otpSent',userAuthController.otpSent);
route.post('/otpVerify',userAuthController.otpVerify);
route.post('/createPass',userAuthController.changePass);
route.post('/login',userAuthController.login);
route.post('./forgetPass',userAuthController.forgetPass);
route.post('./changePass',userAuthController.changePass);
