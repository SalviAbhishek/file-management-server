const LocalStratergy = require("passport-local");
const bcrypt = require("bcryptjs");
const mUserModel = require("../models/Users");

module.exports = async (passport) => {
  passport.use(
    new LocalStratergy({ usernameField: "email" }, (email, password, done) => {
      //Match user
      return mUserModel
        .findOne({ email, isActive: true })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "Email is not registered!",
              code: 401,
            });
          }
          //Password Match
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Password incorrect!",
                code: 501,
              });
            }
          });
        })
        .catch((err) => {
          return err;
        });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    mUserModel.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
