// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, email });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Register error", err);
    next(err); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new Error("User not found");
      error.status = 400;
      throw error; // Ném lỗi để middleware xử lý
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid password");
      error.status = 400;
      throw error; // Ném lỗi để middleware xử lý
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Login error", err);
    next(err); // Chuyển lỗi đến middleware xử lý lỗi
  }
};
