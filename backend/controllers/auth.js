const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const security = require("../helpers/securityHelper");
const UserModel = require("../models/User");

module.exports = {
  create: (email, password) =>
    UserModel.create({ email: email, password: password })
      .then(user => {
        return { id: user._id, email: user.email, settings: user.settings };
      })
      .catch(err => {
        console.error(err.message);
        return err.message.startsWith("E11000")
          ? { err: "Email already in use!" }
          : { err: err.message ? err.message : "Ops, something went wrong." };
      }),
  login: async (email, password) => {
    const user = await UserModel.findOne({ email: email });
    let validUserPasswordCombination = user && user.comparePassword(password);

    let token = {};
    if (validUserPasswordCombination) {
      token = jwt.sign(
        { email: user.email, jti: crypto.randomBytes(16).toString("hex") },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "12h" // expires in 24 hours
        }
      );
    }
    return validUserPasswordCombination
      ? { token: token, userid: user._id }
      : { err: "Wrong username/password combination" };
  },

  logout: userToken => {
    if (userToken) security.revokeToken(userToken);
    return Promise.resolve({ statusCode: 200, message: "Logout user." });
  }
};
