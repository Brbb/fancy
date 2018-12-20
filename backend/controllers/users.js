const UserModel = require("../models/User");

module.exports = {
  all: () =>
    UserModel.find().then(users => {
      return users.map(user => {
        return { id: user._id, email: user.email, settings: user.settings };
      });
    }),

  retrieve: id =>
    UserModel.findOne({ _id: id }).then(user => {
      if (!user) return { err: "User not found" };

      return {
        id: user._id,
        email: user.email,
        settings: user.settings
      };
    }),

  update: (id, options) => {
    let properties = {};
    Object.keys(options).map(key => {
      properties["settings." + key] = options[key];
    });

    let doc = { $set: properties };

    return UserModel.findOneAndUpdate({ _id: id }, doc, {
      new: true,
      runValidators: true
    })
      .then(user => {
        return { id: user._id, email: user.email, settings: user.settings };
      })
      .catch(err => {
        console.error(err);
        return { err: err.message ? err.message : "User not updated" };
      });
  },

  updatePassword: async (id, oldPassword, newPassword) => {
    let user = await UserModel.findOne({ _id: id });
    if (user && user.comparePassword(oldPassword)) {
      user.password = newPassword;
      user.save();
      return { message: "Password changed" };
    }
    return { err: "Password not changed" };
  },

  delete: id =>
    UserModel.deleteOne({ _id: id })
      .then(() => {
        return { message: "User deleted" };
      })
      .catch(err => {
        console.error(err);
        return { err: "User not deleted." };
      })
};
