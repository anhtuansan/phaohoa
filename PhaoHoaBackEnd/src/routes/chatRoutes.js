const express = require("express");
const {
  saveMessage,
  getChatHistory,
} = require("../controllers/chatController");
const verifyToken = require("../middlewares/authMiddleware"); // Middleware kiểm tra đăng nhập

const router = express.Router();
const { chatWithBot } = require("../controllers/chatController");

// Route để lưu tin nhắn
router.post("/save", verifyToken, saveMessage);

// Route để lấy lịch sử chat
router.get("/history", verifyToken, getChatHistory);

router.post("/bot", chatWithBot); // API để chat với chatbot

module.exports = router;
