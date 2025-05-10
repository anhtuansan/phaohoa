const Chat = require("../models/Chat");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

exports.chatWithBot = async (req, res) => {
  try {
    const { message, context = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Lấy dữ liệu sản phẩm từ DB hoặc hardcode
    const products = [
      { name: "Áo thun", price: 200000, description: "Áo thun cotton cao cấp" },
      {
        name: "Quần jeans",
        price: 350000,
        description: "Quần jeans nam co giãn",
      },
    ];
    const productInfo = products
      .map((p) => `${p.name}: ${p.description}, giá ${p.price} VNĐ`)
      .join("\n");

    const systemPrompt = `
Bạn là chatbot tư vấn sản phẩm cho shop. 
Chỉ trả lời các câu hỏi liên quan đến các sản phẩm sau đây và không trả lời các chủ đề khác.
Nếu khách hỏi ngoài danh sách sản phẩm, hãy lịch sự từ chối.
Trả lời ngắn gọn, dễ hiểu, thân thiện, bằng tiếng Việt.
Dưới đây là thông tin sản phẩm của shop:
${productInfo}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...context,
        { role: "user", content: message },
      ],
    });

    const botReply = response.choices[0].message.content;

    res.status(200).json({ success: true, reply: botReply });
  } catch (err) {
    console.error("Error chatting with bot:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to chat with bot" });
  }
};
