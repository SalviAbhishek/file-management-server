const express = require("express");
const router = express.Router();
const mOtpFn = require("../functions/otp");

router.post("/", (req, res) => {
  mOtpFn.sendOtp(req, res);
});

router.get("/", (req, res) => {
  mOtpFn.verifyOtp(req, res);
});

module.exports = router;
