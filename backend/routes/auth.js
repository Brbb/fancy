const ctrl = require("../controllers/users");
const express = require("express");
const router = express.Router();

async function logout(req, res) {
  let result = await ctrl.logout(req.user);
  return res.status(result.statusCode).send(result.message);
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let result = await ctrl.login(email, password);
  return res.status(result.statusCode).send(result.message);
});

// This is called on user deletion to invalidate the Token
router.route("/logout").all(async (req, res) => await logout(req, res));

// The C of CRUD in this case is concern of authorization/security and outside the classic operations
// a registered and logged user can do. Also, the path is unprotected because there's no token for
// unregistered users.

router.post("/signup", async (req, res) => {
  if (req.body.password !== req.body.repeatPassword)
    return res.status(400).send("Passwords must match!");

  const { email, password } = req.body;
  let result = await ctrl.create(email, password);
  return res.status(result.statusCode).send(result.message);
});

module.exports = router;
