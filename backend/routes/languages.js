const express = require("express");
const router = express.Router();
const languages = require("../models/Languages");

router.get("/", async (req, res) => {
	return res.send(languages);
});

module.exports = router;
