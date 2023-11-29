const express = require("express");
const router = express.Router();
const mFilesFn = require("../functions/files");
const mMiddleware = require("../middlewares/authenticator");
const upload = require("../utilities/file-upload");

router.post(
  "/upload",
  mMiddleware.verifyToken,
  upload.single("file"),
  (req, res) => {
    mFilesFn.uploadFile(req, res);
  }
);
router.get("/list", mMiddleware.verifyToken, (req, res) => {
  mFilesFn.listUserFiles(req, res);
});
router.delete("/delete/:id", mMiddleware.verifyToken, (req, res) => {
  mFilesFn.deleteFile(req, res);
});
module.exports = router;
