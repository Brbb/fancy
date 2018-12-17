const ctrl = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  return res.send(await ctrl.all());
});

router.get("/:email", async (req, res) => {
  return res.send(await ctrl.retrieve(req.params.email));
});

router.post("/", async (req, res) => {
  let result = await ctrl.create(req.body);
  return res.status(result.statusCode).send(result.message);
});

module.exports = router;
