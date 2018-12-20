const ctrl = require("../controllers/users");

module.exports = {
	getAll: async (req, res) => {
		return res.send(await ctrl.all());
	},
	getById: async (req, res) => {
		let result = await ctrl.retrieve(req.params.id);
		return res.send(result);
	},
	changePassword: async (req, res) => {
		if (req.body.newPassword !== req.body.repeatNewPassword)
			return res.send({ err: "Passwords must match!" });

		var result = await ctrl.updatePassword(
			req.params.id,
			req.body.oldPassword,
			req.body.newPassword
		);

		if (result.err) return res.send(result);
		return res.redirect(307, "../../auth/logout");
	},
	updateUser: async (req, res) => {
		let result = await ctrl.update(req.params.id, req.body);
		return res.send(result);
	},
	deleteUser: async (req, res) => {
		var result = await ctrl.delete(req.params.id);

		if (!result.err) return res.redirect(307, "../auth/logout");

		return res.send(result);
	}
};
