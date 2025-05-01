const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

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
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  groupId: {
    type: DataTypes.INTEGER, 
    allowNull: true,
  },
}, {
  timestamps: true, 
});

Task.belongsTo(User, { foreignKey: "UserId", onDelete: "CASCADE" });
User.hasMany(Task, { foreignKey: "UserId" });

module.exports = Task;
