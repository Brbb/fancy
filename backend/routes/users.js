const handler = require("../handlers/users");
const express = require("express");
const router = express.Router();
const handle = require("../helpers/promiseHelper").handle;

router.get("/", handle(handler.getAll));
router.get("/:id", handle(handler.getById));
router.put("/:id/password", handle(handler.changePassword));
router.put("/:id", handle(handler.updateUser));
router.delete("/:id", handle(handler.deleteUser));

module.exports = router;
