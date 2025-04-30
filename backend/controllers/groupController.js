const Group = require("../models/group");
const User = require("../models/user");

//Create new group
exports.createGroup = async (req, res) => {
  const { name } = req.body;

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const group = await Group.create({ name });

    const user = await User.findByPk(userId);
    await group.addUser(user); // Add creator to the group

    res.status(201).json(group);
  } catch (err) {
    console.error("Create group error:", err);
    res.status(500).json({ message: "Server error creating group" });
  }
};
// Get group of the current user
exports.getGroups = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: Group,
    });

    res.status(200).json(user.Groups); // user.Groups is populated from association
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

//delete group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    await group.destroy();
    res.status(200).json({ message: "Group deleted" });
  } catch (err) {
    console.error("Delete group error:", err);
    res.status(500).json({ message: "Server error deleting group" });
  }
};

exports.inviteUserToGroup = async (req, res) => {
  const groupId = req.params.id;
  const { email } = req.body;

  try {
    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user is already in the group
    const isAlreadyMember = await group.hasUser(user);
    if (isAlreadyMember) {
      return res.status(400).json({ message: "User already in this group" });
    }

    await group.addUser(user); // Add user to group

    res
      .status(200)
      .json({ message: `User ${user.email} added to group ${group.name}` });
  } catch (err) {
    console.error("Invite user error:", err);
    res.status(500).json({ message: "Server error inviting user" });
  }
};
//Brose group members under each group list
exports.getGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findByPk(groupId, {
      include: {
        model: User,
        attributes: ["id", "name", "email"],
        through: { attributes: [] }, // don't return join table data
      },
    });

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json(group.Users);
  } catch (err) {
    console.error("Get group members error:", err);
    res.status(500).json({ message: "Server error fetching members" });
  }
};

// Remove a user from a group
exports.removeMember = async (req, res) => {
  try {
    const { groupId, userIdToRemove } = req.params;

    const group = await Group.findByPk(groupId);
    const user = await User.findByPk(userIdToRemove);

    if (!group || !user) {
      return res.status(404).json({ message: "Group or user not found." });
    }

    await group.removeUser(user);

    res.status(200).json({ message: "User removed from group." });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ message: "Server error removing user." });
  }
};
