const Group = require("../models/group");
const User = require("../models/user");

// Create a new group
exports.createGroup = async (req, res) => {
  const { name } = req.body;

  try {
    const group = await Group.create({ name });
    res.status(201).json(group);
  } catch (err) {
    console.error("Create group error:", err);
    res.status(500).json({ message: "Server error creating group" });
  }
};

// Get all groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json(groups);
  } catch (err) {
    console.error("Fetch groups error:", err);
    res.status(500).json({ message: "Server error fetching groups" });
  }
};

// Get users in a specific group
exports.getUsersInGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [User],
    });

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.status(200).json(group.Users);
  } catch (err) {
    console.error("Fetch group users error:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};
