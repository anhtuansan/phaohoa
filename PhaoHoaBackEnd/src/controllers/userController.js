// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.profile = async (req, res) => {
  try {
    // Lấy id từ JWT payload
    const userId = req.user.id;

    // Truy vấn lại database để lấy user đầy đủ thông tin
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Loại bỏ password nếu không muốn trả về
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Thông tin người dùng",
      user,
    });
  } catch (error) {
    console.error(error);
    next(err); // Chuyển lỗi đến middleware xử lý lỗi
  }
};
