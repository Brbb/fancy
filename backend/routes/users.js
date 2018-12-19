const ctrl = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  return res.send(await ctrl.all());
});

// see auth.js for the Creation of a new user

router.get("/:id", async (req, res) => {
  let result = await ctrl.retrieve(req.params.id).catch(err => {
    console.error(err);
    return res.status(500);
  });
  return res.send(result);
});

router.put("/:id/password", async (req, res) => {
  if (req.body.newPassword !== req.body.repeatNewPassword)
    return res.status(400).send("Passwords must match!");

  let result = await ctrl.updatePassword(
    req.params.id,
    req.body.oldPassword,
    req.body.newPassword
  );
  if (result.statusCode == 200) {
    return res.redirect(307, "../../auth/logout");
  }
  return res.status(result.statusCode).send(result.message);
});

router.put("/:id", async (req, res) => {
  let result = await ctrl.update(req.params.id, req.body);
  return res.status(result.statusCode).send(result.message);
});

router.delete("/:id", async (req, res) => {
  var result = await ctrl.delete(req.params.id);

  if (result.statusCode == 200) {
    return res.redirect(307, "../auth/logout");
  }
  return res.status(result.statusCode).send(result.message);
});

module.exports = router;
