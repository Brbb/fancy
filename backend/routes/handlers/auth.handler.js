const ctrl = require("../../controllers/auth");

module.exports = {
	login: async (req, res) => {
		if (!req.body) return res.send({ err: "Request needs body" });

		const { email, password } = req.body;
		if (!email || !password)
			return res.send({ err: "Body needs email and password properties" });

		let result = await ctrl.login(email, password);
		return res.send(result);
	},
	logout: async (req, res) => {
		let result = await ctrl.logout(req.user);
		return res.send(result);
	},
	signup: async (req, res) => {
		if (!req.body) return res.send({ err: "Request needs body" });

		if (req.body.password !== req.body.repeatPassword)
			return res.send({ err: "Passwords must match!" });

		const { email, password } = req.body;
		if (!email || !password)
			return res.send({ err: "Body needs email and password properties" });

		let result = await ctrl.create(email, password);
		return res.send(result);
	}
};
