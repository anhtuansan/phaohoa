const AWS = require("aws-sdk");

// Cấu hình AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID, // Lấy từ file .env
  secretAccessKey: process.env.SECRET_ACCESS_KEY, // Lấy từ file .env
  region: process.env.BUCKET_REGION, // Lấy từ file .env
});

module.exports = s3;
