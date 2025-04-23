const express = require("express");
const router = express.Router();
const task = require("../models/task");

router.post("/", async (req, res) => {
  const { name, status, frequency, dueDate, assignedTo, notes } = req.body;

  try {
    const newTask = await task.create({
      name,
      status,
      frequency,
      dueDate,
      assignedTo,
      notes,
    });

    res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
});

module.exports = router;
