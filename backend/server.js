const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const task = require("./models/task");
const taskRoutes = require("./routes/taskRoutes");
const groupRoutes = require("./routes/groupRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/groups", groupRoutes);

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
  app.listen(3001, () => console.log('Server running on port 3001'));
});
