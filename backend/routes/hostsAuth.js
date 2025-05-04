const express = require("express");
const route = express.Router();

route.post('/api/v1/host/otpSent');
route.post('/api/v1/host/otpVerify');
route.post('/api/v1/host/createPass');
route.post('/api/v1/host/login');
route.post('/api/v1/host/forgetPass');
route.post('/api/v1/host/changePass');