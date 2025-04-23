const Task = require("../models/task");

// Create a task
exports.createTask = async (req, res) => {
  const { name, status, frequency, dueDate, assignedTo, notes, UserId } =
    req.body;

  try {
    const newTask = await Task.create({
      name,
      status,
      frequency,
      dueDate,
      assignedTo,
      notes,
      UserId,
    });

    res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

//GET ALL TASK
exports.getAllTasks = async (req, res) => {
  try {
    console.log("⏳ Attempting to fetch all tasks...");
    const tasks = await Task.findAll();
    console.log("Fetched tasks:", tasks);
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    console.error(err);
    res.status(500).json({ message: "Server error fetching tasks,check JSON" });
  }
};
// GET task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Server error fetching task" });
  }
};

// UPDATE task by ID
exports.updateTask = async (req, res) => {
  const { name, status, frequency, dueDate, assignedTo, notes } = req.body;

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.update({
      name,
      status,
      frequency,
      dueDate,
      assignedTo,
      notes,
    });

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// DELETE task by ID
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.destroy();
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error deleting task" });
  }
};
