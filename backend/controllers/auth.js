const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const security = require("../helpers/securityHelper");
const UserModel = require("../models/User");

var auth = (module.exports = {
	create: (email, password) =>
		UserModel.create({ email: email, password: password })
			.then(user => {
				return { id: user._id, email: user.email, settings: user.settings };
			})
			.catch(err => {
				return err.message.startsWith("E11000")
					? { err: "Email already in use!" }
					: { err: "Ops, something went wrong." };
			}),

	login: async (email, password) => {
		var user = auth.verifyUserPassword(email, password);
		if (user) {
			let token = auth.getToken(user.email);
			return { token: token, userId: user._id };
		}
		return { err: "Wrong username/password combination" };
	},

	logout: userToken => {
		if (userToken) security.revokeToken(userToken);
		return Promise.resolve({ message: "Logout user" });
	},

	getToken: email =>
		jwt.sign(
			{ email: email, jti: crypto.randomBytes(16).toString("hex") },
			process.env.TOKEN_SECRET,
			{
				expiresIn: "12h"
			}
		),

	verifyUserPassword: async (email, password) => {
		const user = await UserModel.findOne({ email: email });
		if (user && user.comparePassword(password)) return user;
		return false;
	}
});
