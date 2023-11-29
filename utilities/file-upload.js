var multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "-" + file.originalname;
    cb(null, filename); // Set the filename for uploaded files
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
