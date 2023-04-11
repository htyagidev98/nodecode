const { signup, login, forgotPassword, otpVerification, sendMail, resetPassword } = require("../controller/authController");
const express = require("express");
const xAccessToken = require("../middlewares/xAccessToken");

router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/forgot/password', forgotPassword);
router.post('/otp/verification', xAccessToken.token, otpVerification);
router.post('/reset/password', xAccessToken.token, resetPassword);
router.get('/send/mail', xAccessToken.token, sendMail)
module.exports = router;
