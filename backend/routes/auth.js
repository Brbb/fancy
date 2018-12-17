const ctrl = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  let result = await ctrl.login(email, password);
  return res.send(result);
});

module.exports = router;
