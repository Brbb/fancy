const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
  all: () =>
    UserModel.find().then(users => {
      return users.map(user => {
        return { email: user.email, settings: user.settings };
      });
    }),
  create: options =>
    UserModel.create(options)
      .then(() => {
        return { statusCode: 201, message: "New user created" };
      })
      .catch(err => {
        return err.message.startsWith("E11000")
          ? { statusCode: 500, message: "Email already in use!" }
          : { statusCode: 500, message: "Ops, something went wrong." };
      }),
  retrieve: email =>
    UserModel.findOne({ email: email }).then(user => {
      // we don't want to return the password
      return { email: user.email, settings: user.settings };
    }),
  update: email => {},
  delete: email => {
    return UserModel.deleteOne({ email: email });
  },
  login: async (email, password) => {
    const user = await UserModel.findOne({ email: email });
    let validUserPasswordCombination = false;
    if (user) {
      validUserPasswordCombination = user.comparePassword(password);
    }
    var token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, {
      expiresIn: "24h" // expires in 24 hours
    });
    return validUserPasswordCombination
      ? { success: true, message: "Welcome back!", token: token }
      : {
          success: false,
          message: "Wrong user/password combination."
        };
  }
};
