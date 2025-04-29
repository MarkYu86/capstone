const Task = require("../models/task");

exports.getTasksForGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;

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
