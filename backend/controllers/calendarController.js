// controllers/calendarController.js

const { Task } = require('../models');

const getTasksForGroup = async (req, res) => {
  try {
    // ✅ Step 1: Parse and log groupId
    const groupId = parseInt(req.params.groupId, 10);
    console.log("Parsed group ID:", groupId);

    // ✅ Step 2: Fetch and log filtered tasks
    const tasks = await Task.findAll({
      where: { groupId: groupId },
    });
    console.log("Filtered tasks:", tasks);

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks for group:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasksForGroup,
};
