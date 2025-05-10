// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const axios = require("axios");

const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  const response = await axios.post(url);
  return response.data.success;
};

exports.register = async (req, res, next) => {
  const { username, password, email, recaptchaToken } = req.body;
  try {
    // Kiểm tra reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, email });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Register error", err);
    next(err); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

exports.login = async (req, res, next) => {
  const { username, password, recaptchaToken } = req.body;
  try {
    // Kiểm tra reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

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
