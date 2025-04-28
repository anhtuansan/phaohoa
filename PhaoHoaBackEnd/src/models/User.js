// src/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user", // Mặc định ai cũng là user
    },
    latitude: {
      type: DataTypes.FLOAT, // Lưu vĩ độ
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT, // Lưu kinh độ
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
