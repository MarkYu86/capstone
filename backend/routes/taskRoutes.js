const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/authMiddleware");

//CREATE
router.post("/", verifyToken, taskController.createTask);

//READ all
router.get("/", verifyToken, taskController.getAllTasks);

//READ one
router.get("/:id", verifyToken, taskController.getTaskById);

//UPDATE
router.put("/:id", verifyToken, taskController.updateTask);

//DELETE
router.delete("/:id", verifyToken, taskController.deleteTask);

module.exports = router;
