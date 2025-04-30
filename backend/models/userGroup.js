const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserGroups = sequelize.define("UserGroups", {
  // Add extra fields if needed (like role, joinedAt, etc.)
});

module.exports = UserGroups;