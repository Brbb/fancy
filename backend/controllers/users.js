const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const security = require("../handlers/security");

module.exports = {
  all: () =>
    UserModel.find().then(users => {
      return users.map(user => {
        return { id: user._id, email: user.email, settings: user.settings };
      });
    }),

  create: (email, password) =>
    UserModel.create({ email: email, password: password })
      .then(user => {
        return {
          statusCode: 201,
          message: { id: user._id, email: user.email, settings: user.settings }
        };
      })
      .catch(err => {
        return err.message.startsWith("E11000")
          ? { statusCode: 500, message: "Email already in use!" }
          : { statusCode: 500, message: "Ops, something went wrong." };
      }),

  retrieve: id =>
    UserModel.findOne({ _id: id }).then(user => {
      if (!user) {
        return { statusCode: 404, message: "User not found" };
      }
      return {
        statusCode: 200,
        message: { id: user._id, email: user.email, settings: user.settings }
      };
    }),

  update: (id, options) => {
    let properties = {};
    Object.keys(options).map(key => {
      properties["settings." + key] = options[key];
    });

    let doc = { $set: properties };

    return UserModel.findOneAndUpdate({ _id: id }, doc, { new: true })
      .then(user => {
        return {
          statusCode: 200,
          message: { id: user._id, email: user.email, settings: user.settings }
        };
      })
      .catch(err => {
        console.error(err);
        return { statusCode: 500, message: "User not updated" };
      });
  },

  updatePassword: async (id, oldPassword, newPassword) => {
    let user = await UserModel.findOne({ _id: id });
    if (user && user.comparePassword(oldPassword)) {
      user.password = newPassword;
      user.save();
      return {
        statusCode: 200,
        message: "Password changed"
      };
    }
    return {
      statusCode: 500,
      message: "Password not changed"
    };
  },

  delete: id =>
    UserModel.deleteOne({ _id: id })
      .then(() => {
        return { statusCode: 200, message: "User deleted" };
      })
      .catch(err => {
        console.error(err);
        return { statusCode: 500, message: "Ops, something went wrong." };
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
      ? {
          statusCode: 200,
          message: { success: true, token: token, userid: user._id }
        }
      : {
          statusCode: 200,
          message: {
            success: false,
            reason: "Wrong username/password combination"
          }
        };
  },

  logout: userToken => {
    if (userToken) security.revokeToken(userToken);
    return Promise.resolve({ statusCode: 200, message: "See you!" });
  }
};
