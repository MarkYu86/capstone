const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

//CREATE
router.post("/", taskController.createTask);

//READ all
router.get("/", taskController.getAllTasks);

//READ one
router.get("/:id", taskController.getTaskById);

//UPDATE
router.put("/:id", taskController.updateTask);

//DELETE
router.delete("/:id", taskController.deleteTask);

module.exports = router;
