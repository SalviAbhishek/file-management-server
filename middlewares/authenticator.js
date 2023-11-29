const jwt = require("jsonwebtoken");
const mKeys = require("../utilities/keys");
const mUserModel = require("../models/Users");

/* ------------------------------ verify access token ----------------------------- */
exports.verifyToken = async function (req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken, mKeys.jwt_key, async (err, authData) => {
      if (err) {
        res
          .status(403)
          .send({ message: "authorization token is invalid!", code: 403 });
      } else {
        try {
          let user = await mUserModel
            .findOne(
              { _id: authData.user._id },
              {
                _id: 1,
              }
            )
            .lean();
          if (user) {
            req.userData = user;
            next();
          } else {
            res.status(500).send({
              message: "authorization token is malformed!",
              code: 501,
            });
          }
        } catch (error) {
          res.status(500).send({ message: error.message, code: 500 });
        }
      }
    });
  } else {
    res.status(403).send({ message: "Unauthorized request!", code: 403 });
  }
};
