const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/", groupController.createGroup);
router.get("/", groupController.getGroups);
router.get("/:id/users", groupController.getUsersInGroup);

module.exports = router;
