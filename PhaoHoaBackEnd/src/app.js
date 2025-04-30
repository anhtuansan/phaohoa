require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const errorHandler = require("./middlewares/errorHandler");
const Chat = require("./models/Chat");

const app = express();
const server = http.createServer(app); // Tạo server HTTP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL của frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.IO: Lắng nghe các sự kiện từ client
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Xử lý sự kiện gửi tin nhắn
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      // Lưu tin nhắn vào cơ sở dữ liệu
      const chat = await Chat.create({ senderId, receiverId, message });

      // Gửi tin nhắn đến người nhận
      console.log("Message received:", chat);
      io.to(receiverId.toString()).emit("receiveMessage", chat);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Xử lý khi người dùng tham gia phòng chat
  socket.on("joinRoom", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room`);
  });

  // Xử lý khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Kết nối cơ sở dữ liệu và khởi động server
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to SQL Server");
    // Tự động tạo bảng nếu chưa có
    return sequelize.sync({}); // Sử dụng alter để cập nhật bảng nếu cần
  })
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Unable to connect to database", err));
