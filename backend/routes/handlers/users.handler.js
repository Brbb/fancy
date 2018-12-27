const ctrl = require("../../controllers/users");

module.exports = {
	getAll: async (req, res) => {
		return res.send(await ctrl.all());
	},
	getById: async (req, res) => {
		if (!req.params || !req.params.id) return res.status(400).send("Invalid parameters!");
		let result = await ctrl.retrieve(req.params.id);
		if (result.err) return res.status(400).send(result);
		return res.send(result);
	},
	changePassword: async (req, res) => {
		if (!req.body) return res.status(400).send({ err: "Invalid request format!" });
		if (!req.body.newPassword || !req.body.oldPassword || !req.body.repeatNewPassword)
			return res.status(400).send({
				err: "Invalid request format! All the password fields are required."
			});
		if (req.body.newPassword !== req.body.repeatNewPassword)
			return res.status(401).send({ err: "Passwords must match!" });

		var result = await ctrl.updatePassword(
			req.params.id,
			req.body.oldPassword,
			req.body.newPassword
		);

		if (result.err) return res.status(400).send(result);
		return res.redirect(307, "../../auth/logout");
	},
	updateUser: async (req, res) => {
		if (!req.params) return res.status(401).send("Invalid parameters!");
		let result = await ctrl.update(req.params.id, req.body);
		if (result.err) return res.status(400).send(result);
		return res.send(result);
	},
	deleteUser: async (req, res) => {
		if (!req.params) return res.status(401).send("Invalid parameters!");

		var result = await ctrl.delete(req.params.id);
		if (!result.err) return res.redirect(307, "../auth/logout");
		return res.status(400).send(result);
	}
};
