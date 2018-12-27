const handler = require("./handlers/auth.handler");
const express = require("express");
const router = express.Router();
const handle = require("../helpers/promiseHelper").handle;

// I could put all the methods from auth.handler.js here, but I like separate little handlers for testability/readability purpose.

/*async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.send("Body needs email and password properties");

  let result = await ctrl.login(email, password);
  return res.send(result);
}*/

router.post("/login", handle(handler.login));
router.route("/logout").all(handle(handler.logout));
router.post("/signup", handle(handler.signup));

module.exports = router;
