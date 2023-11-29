const express = require("express");
const router = express.Router();
const mAuthFn = require("../functions/auth");

router.post("/register", (req, res) => {
  mAuthFn.register(req, res);
});

router.post("/login", (req, res) => {
  mAuthFn.login(req, res);
});

router.post("/logout", (req, res) => {
  mAuthFn.logout(req, res);
});
module.exports = router;
