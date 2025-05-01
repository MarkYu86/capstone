const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/authMiddleware");

//create
router.post("/", verifyToken, taskController.createTask);

//get all task
router.get("/", verifyToken, taskController.getAllTasks);

//get one task
router.get("/:id", verifyToken, taskController.getTaskById);

//update
router.put("/:id", verifyToken, taskController.updateTask);

//delete
router.delete("/:id", verifyToken, taskController.deleteTask);

// get tasks by groupId
router.get("/group/:groupId", verifyToken, taskController.getTasksByGroup);
module.exports = router;
