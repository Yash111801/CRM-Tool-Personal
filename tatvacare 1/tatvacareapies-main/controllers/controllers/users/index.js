const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const db = require("../../models");
const { SALT_ROUND } = require("../../config");
const fs = require("fs");
const path = require("path");
const User = db.users;

const getUsers = (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField,
      sortOrder,
    } = req.body;
    const query = {
      role: { $in: ["CRM", "CMT"] },
    };
    if (search && search !== "") {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ];
    }
    // sort
    let sort = {};
    if (sortField && sortOrder) {
      sort[sortField] = sortOrder;
    } else {
      sort["createdAt"] = -1;
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
    };
    User.paginate(query, options, (error, result) => {
      if (error) {
        return res.json({
          status: 201,
          message: error.message,
        });
      } else {
        return res.json({
          status: 200,
          data: result,
          message:
            result.docs.length > 0
              ? "Users fetched successfully."
              : "No users found",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while fetching users.",
    });
  }
};

// create new user CRM, CMT
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const salt = parseInt(SALT_ROUND) || 12;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const user = await newUser.save();
    if (user._id !== null && user._id !== undefined && user._id !== "") {
      res.json({
        status: 200,
        message: "User added successfully.",
      });
    } else {
      res.json({
        status: 201,
        message: "Some error occurred while adding user.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while adding user.",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { email } = req.body;
    // Check if email exists for another user
    const existingUser = await User.findOne({ _id: { $ne: id }, email });
    if (existingUser) {
      return res.json({
        status: 201,
        message: "Email already exists with a different account.",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });
    if (!updatedUser) {
      return res.json({
        status: 201,
        message: `Cannot update user with id=${id}. Maybe user was not found!`,
      });
    }
    res.json({
      status: 200,
      message: "User updated successfully.",
    });
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while update user.",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { isActive },
      { new: true }
    );
    if (user) {
      res.json({
        status: 200,
        message: `User ${isActive ? "activated" : "deactivated"} successfully.`,
      });
    } else {
      res.json({
        status: 201,
        message: "User not found.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while remove user.",
    });
  }
};

const changeProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const fileName = req.file.filename;
    const imageUrl = `/${fileName}`;
    const data = await User.findById(userId);

    const prevImage = data.profileImg;

    const prevImagePath = path.join(__dirname, "../../public", prevImage);
    fs.unlink(prevImagePath, (err) => {
      if (err) {
        console.error("Failed to delete previous image:", err.message);
      } else {
        console.log("Previous image deleted successfully.");
      }
    });
    await User.findByIdAndUpdate(userId, { profileImg: imageUrl });
    res.json({ status: 200, message: "Image uploaded", data: imageUrl });
  } catch (error) {
    res.json({
      status: 201,
      message:
        error.message || "Some error occurred while changing profile image.",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, oldPassword, newPassword } = req.body;
    if (!id) {
      return res.json({ status: 400, message: "ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ status: 400, message: "Invalid ID format." });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.json({ status: 201, message: 'User not found' });
    }
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.json({ status: 201, message: 'Old password is incorrect' });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
    }
    if (name) user.name = name;
    await user.save();
    res.json({
      status: 200,
      message: "User updated successfully.",
    });
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while update user.",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  changeProfile,
  updateUserProfile
};
