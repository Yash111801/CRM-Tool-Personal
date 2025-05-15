const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
const { generateJsonwebtoken } = require("../utils/Helper");
const User = db.users;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isActive)
      return res
        .status(403)
        .json({ status: 403, message: "User account is inactive" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });
    if(user && user?._id) {
      await updateLastAccess(user?._id);
    }
    const token = await generateJsonwebtoken(user);
    res.json({
      status: 200,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        token: token,
        name: user.name,
        email: user.email,
        profileImage: user.profileImg,
      },
      message: "You are successfully logged in.",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      message: "Something went wrong" || error.message,
    });
  }
});

const updateLastAccess = async (userId) => {
  await User.findByIdAndUpdate(userId, { lastAccess: new Date() });
};

module.exports = router;
