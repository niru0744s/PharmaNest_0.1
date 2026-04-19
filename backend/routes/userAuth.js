const express = require('express');
const route = express.Router();
const userAuthController = require('../controllers/User/AuthController');
const validations = require("../middleware/schemaValidate");
const { userMiddleware } = require('../middleware/tokenVerify');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

// route.post('/otpSent', validations.validateEmail, userAuthController.otpSent);
route.post('/otpVerify', validations.otp, userAuthController.otpVerify);
route.post('/createPass', validations.userCredentials, userAuthController.createPass);
route.post('/login', validations.login, userAuthController.login);
route.get('/profile', userMiddleware, userAuthController.getProfile);
route.put('/update-profile', userMiddleware, userAuthController.updateProfile);
route.put('/update-profile-image', userMiddleware, upload.single('profileImage'), userAuthController.updateProfileImage);
route.post('/register', validations.register, userAuthController.register);
route.post('/forgetPass', userAuthController.forgetPass);
route.post('/changePass', validations.changePass, userAuthController.changePass);
route.delete('/delete-account', userMiddleware, userAuthController.deleteAccount);

module.exports = route;
