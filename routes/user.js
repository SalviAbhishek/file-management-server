const express = require("express");
const router = express.Router();
const mUserFn = require("../functions/user");
const mMiddleware = require("../middlewares/authenticator");

router.put("/updateUser", mMiddleware.verifyToken, (req, res) => {
  mUserFn.updateUser(req, res);
});
router.get("/", mMiddleware.verifyToken, (req, res) => {
  mUserFn.getUser(req, res);
});
module.exports = router;
