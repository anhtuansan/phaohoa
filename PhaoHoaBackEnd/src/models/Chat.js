const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER, // ID của người gửi
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER, // ID của người nhận
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT, // Nội dung tin nhắn
      allowNull: false,
    },
  },
  {
    timestamps: true, // Tự động thêm cột createdAt và updatedAt
  }
);

module.exports = Chat;
