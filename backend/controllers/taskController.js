const Task = require("../models/task");
const User = require("../models/user");
const Group = require("../models/group");
const { Op } = require("sequelize");

// 🔁 Utility: check if user is in a group
const isUserInGroup = async (user, groupId) => {
  const groups = await user.getGroups();
  return groups.some(group => group.id === parseInt(groupId, 10));
};

// ✅ Create a task (requires groupId in body)
exports.createTask = async (req, res) => {
  const { groupId, ...taskData } = req.body;
  console.log("Create task payload:", req.body);
  try {
    const user = await User.findByPk(req.user.id);
    if (groupId) {
      const isMember = await isUserInGroup(user, groupId);
      if (!isMember) {
        return res.status(403).json({ message: "You are not a member of this group" });
      }
    }

    const task = await Task.create({
      ...taskData,
      groupId,
      UserId: user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// ✅ Get all tasks for groups the user belongs to
exports.getAllTasks = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: Group });
    const groupIds = user.Groups.map(group => group.id);
    
    let whereClause = {};

    if (groupIds.length > 0) {
      // If the user belongs to groups, return tasks that are either group tasks or personal tasks.
      whereClause = {
        [Op.or]: [
          { groupId: groupIds },
          { groupId: null, UserId: user.id }
        ]
      };
    } else {
      // User has no groups; just return personal tasks.
      whereClause = { groupId: null, UserId: user.id };
    }

    const tasks = await Task.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};


// ✅ Get task by ID (and check group membership)
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = await User.findByPk(req.user.id);

    if (task.groupId) {
      if (!(await isUserInGroup(user, task.groupId))) {
        return res.status(403).json({ message: "Not allowed to view this task" });
      }
    } else {
      if (task.UserId !== user.id) {
        return res.status(403).json({ message: "Not allowed to access this personal task" });
      }
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Server error fetching task" });
  }
};

// ✅ Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = await User.findByPk(req.user.id);
    if (task.groupId) {
      if (!(await isUserInGroup(user, task.groupId))) {
        return res.status(403).json({ message: "Not allowed to access this group task" });
      }
    } else {
      if (task.UserId !== user.id) {
        return res.status(403).json({ message: "Not allowed to access this personal task" });
      }
    }

    await task.update(req.body);
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// ✅ Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = await User.findByPk(req.user.id);
    if (task.groupId) {
      if (!(await isUserInGroup(user, task.groupId))) {
        return res.status(403).json({ message: "Not allowed to access this group task" });
      }
    } else {
      if (task.UserId !== user.id) {
        return res.status(403).json({ message: "Not allowed to access this personal task" });
      }
    }

    await task.destroy();
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error deleting task" });
  }
};

// ✅ Get tasks for a specific group
exports.getTasksByGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const user = await User.findByPk(req.user.id);
    if (!(await isUserInGroup(user, groupId))) {
      return res.status(403).json({ message: "Access denied: not a group member" });
    }

    const tasks = await Task.findAll({
      where: { groupId },
      order: [["dueDate", "ASC"]],
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching group tasks:", err);
    res.status(500).json({ message: "Server error fetching group tasks" });
  }
};
