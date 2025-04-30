const express = require("express");
const {
  saveMessage,
  getChatHistory,
} = require("../controllers/chatController");
const verifyToken = require("../middlewares/authMiddleware"); // Middleware kiểm tra đăng nhập

const router = express.Router();

// Route để lưu tin nhắn
router.post("/save", verifyToken, saveMessage);

// Route để lấy lịch sử chat
router.get("/history", verifyToken, getChatHistory);

module.exports = router;
