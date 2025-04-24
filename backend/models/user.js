const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Group = require("./group");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.belongsTo(Group, { foreignKey: "GroupId" });
Group.hasMany(User, { foreignKey: "GroupId" });

module.exports = User;
