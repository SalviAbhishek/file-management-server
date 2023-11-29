const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const mKeys = require("./utilities/keys");
const mMongoUtils = require("./utilities/mongo");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
app.use(
  session({ secret: mKeys.sessionKey, resave: false, saveUninitialized: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
/*---------------------------- routes started here -----------------------------------------*/
app.use("/otp", require("./routes/otp"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/files", require("./routes/files"));
/*---------------------------- routes ended here-----------------------------------------*/

/*---------------------------- server started here-----------------------------------------*/
const server = app.listen(PORT, async () => {
  const client = await mongoose.connect(mMongoUtils.MongoURI, {});
  console.log(`server started on port ${PORT}`);
});
