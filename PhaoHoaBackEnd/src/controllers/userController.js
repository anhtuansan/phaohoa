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

exports.saveUserLocation = async (req, res, next) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "User ID, latitude, and longitude are required" });
    }

    // Tìm user theo ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cập nhật vị trí
    user.latitude = latitude;
    user.longitude = longitude;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User location updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error saving user location", err);
    next(err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "user" }, // Lấy tất cả người dùng có role là "user"
      attributes: ["id", "username", "email"], // Chỉ trả về các trường cần thiết
    });
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};
