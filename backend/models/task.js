const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("incomplete", "complete", "overdue"),
    defaultValue: "incomplete",
  },
  frequency: {
    type: DataTypes.ENUM("once", "daily", "weekly", "monthly"),
    defaultValue: "once",
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.STRING, // can link to userId later
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Task;
