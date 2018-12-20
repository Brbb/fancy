const handler = require("../handlers/auth");
const express = require("express");
const router = express.Router();
const handle = require("../helpers/promiseHelper").handle;

router.post("/login", handle(handler.login));
router.route("/logout").all(handle(handler.logout));
router.post("/signup", handle(handler.signup));


module.exports = router;
