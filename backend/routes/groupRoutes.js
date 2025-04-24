const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/", groupController.createGroup);
router.get("/", groupController.getGroups);
router.get("/:id/users", groupController.getUsersInGroup);
router.delete("/:id", groupController.deleteGroup);

router.post("/:id/invite", verifyToken, groupController.inviteUserToGroup);


module.exports = router;
