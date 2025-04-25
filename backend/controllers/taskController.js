const Task = require("../models/task");
const User = require("../models/user");

// Create a task
exports.createTask = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const groupId = user.GroupId || null;

    if (!groupId) {
      return res.status(400).json({ message: "User is not in a group" });
    }

    const task = await Task.create({
      ...req.body,
      groupId,
      UserId: req.user.id, // Creator
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// Get all tasks (group scope)
exports.getAllTasks = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user.GroupId) {
      return res.status(200).json([]); // No group = no tasks
    }

    const tasks = await Task.findAll({
      where: { groupId: user.GroupId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const task = await Task.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.groupId !== user.GroupId) {
      return res.status(403).json({ message: "Not allowed to view this task" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Server error fetching task" });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const task = await Task.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.groupId !== user.GroupId) {
      return res.status(403).json({ message: "Not allowed to update this task" });
    }

    await task.update(req.body);
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    console.log("DELETE /tasks/:id called");
    console.log("req.user:", req.user);
    console.log("req.params.id:", req.params.id);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: missing user info" });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      console.log("Task not found");
      return res.status(404).json({ message: "Task not found" });
    }
    if (!user.GroupId || task.groupId !== user.GroupId) {
      console.log("User not allowed to delete this task");
      return res.status(403).json({ message: "Not allowed to delete this task" });
    }
    await task.destroy();
    console.log("Task deleted successfully");
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error deleting task" });
  }
};
