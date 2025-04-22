const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require("./routes/userRoutes");

const protectedRoutes = require("./routes/protectedRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/protected", protectedRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(3001, () => console.log('Server running on port 3001'));
});
