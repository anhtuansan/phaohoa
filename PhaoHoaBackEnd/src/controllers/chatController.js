const Chat = require("../models/Chat");

exports.saveMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Lưu tin nhắn vào cơ sở dữ liệu
    const chat = await Chat.create({ senderId, receiverId, message });

    res.status(201).json({ success: true, chat });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false, message: "Failed to save message" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { userId, receiverId } = req.query;

    if (!userId || !receiverId) {
      return res
        .status(400)
        .json({ message: "User ID and Admin ID are required" });
    }

    // Lấy lịch sử chat giữa user và admin
    const chats = await Chat.findAll({
      where: {
        senderId: [userId, receiverId],
        receiverId: [userId, receiverId],
      },
      order: [["createdAt", "ASC"]], // Sắp xếp theo thời gian tăng dần
    });

    res.status(200).json({ success: true, chats });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat history" });
  }
};
