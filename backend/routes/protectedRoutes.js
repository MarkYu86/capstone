const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Dashboard access granted",
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;
