const Task = require("../models/task");
const User = require("../models/user");
const Group = require("../models/group");

//Get tasks in group
const getTasksForGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const user = await User.findByPk(req.user.id, {
      include: Group,
    });

    // Check if user belongs to the group
    const isMember = user.Groups?.some((g) => g.id === groupId);
    if (!isMember) {
      return res.status(403).json({ message: "Access denied: not a group member" });
    }

    // Fetch the tasks
    const tasks = await Task.findAll({
      where: { groupId },
      order: [["dueDate", "ASC"]],
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks for group:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTasksForGroup,
};
