// src/config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false, // disable SSL
        trustServerCertificate: true, // accept any cert
      },
    },
  }
);

module.exports = sequelize;
