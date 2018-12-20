const ctrl = require("../controllers/auth");

module.exports = {
	login: async (req, res) => {
		const { email, password } = req.body;
		let result = await ctrl.login(email, password);
		return res.send(result);
	},
	logout: async (req, res) => {
		let result = await ctrl.logout(req.user);
		return res.send(result);
	},
	signup: async (req, res) => {
		if (req.body.password !== req.body.repeatPassword)
			return res.send({ err: "Passwords must match!" });

		const { email, password } = req.body;
		let result = await ctrl.create(email, password);
		return res.send(result);
	}
};
