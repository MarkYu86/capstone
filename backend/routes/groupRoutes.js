const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.get("/", verifyToken, groupController.getGroups);
router.post("/", verifyToken, groupController.createGroup);
router.get("/:id/users", groupController.getUsersInGroup);
router.delete("/:id", groupController.deleteGroup);

router.post("/:id/invite", verifyToken, groupController.inviteUserToGroup);
router.get("/:id/members", verifyToken, groupController.getGroupMembers);
router.put("/remove/:userIdToRemove", verifyToken, groupController.removeMember);


module.exports = router;
