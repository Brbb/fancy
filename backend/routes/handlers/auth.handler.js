const ctrl = require("../../controllers/auth");

module.exports = {
	login: async (req, res) => {
		if (!req.body) return res.status(400).send({ err: "Request needs body" });

		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).send({ err: "Body needs email and password properties" });

		let result = await ctrl.login(email, password);
		if (result.err) return res.status(400).send(result);
		return res.send(result);
	},
	logout: async (req, res) => {
		let result = await ctrl.logout(req.user);
		if (result.err) return res.status(400).send(result);
		return res.send(result);
	},
	signup: async (req, res) => {
		if (!req.body) return res.status(400).send({ err: "Request needs body" });

		if (req.body.password !== req.body.repeatPassword)
			return res.status(400).send({ err: "Passwords must match!" });

		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).send({ err: "Body needs email and password properties" });

		let result = await ctrl.create(email, password);
		if (result.err) return res.status(409).send(result);
		return res.send(result);
	}
};
