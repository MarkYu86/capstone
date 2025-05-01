const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.get("/", verifyToken, groupController.getGroups);
router.post("/", verifyToken, groupController.createGroup);

router.get("/:id/users", groupController.getUsersInGroup);
router.get("/:id/members", verifyToken, groupController.getGroupMembers);

router.post("/:id/invite", verifyToken, groupController.inviteUserToGroup);
router.put("/remove/:groupId/:userIdToRemove", verifyToken, groupController.removeMember);

router.delete("/:id", groupController.deleteGroup); //

module.exports = router;
