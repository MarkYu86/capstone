const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const calendarController = require("../controllers/calendarController");

router.get("/:groupId", verifyToken, calendarController.getTasksForGroup);

module.exports = router;
