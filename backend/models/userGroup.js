const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserGroups = sequelize.define("UserGroups", {
  // Add extra if needed like role, joinedAt, etc
});

module.exports = UserGroups;