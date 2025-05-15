const jwt = require("jsonwebtoken");
const db = require("../models");
const { SECRET } = require('../config');
const User = db.users;

exports.clientAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token missing or invalid" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.isActive) {
      return res.status(401).json({ message: "User not active or not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
