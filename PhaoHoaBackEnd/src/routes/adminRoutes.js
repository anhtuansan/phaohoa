// filepath: d:\Project\PhaoHoaBackEnd\src\routes\adminRoutes.js
const express = require("express");
const {
  uploadProductImage,
  uploadImageAndSaveToDB,
} = require("../controllers/adminController");

const router = express.Router();

// Route upload ảnh và lưu vào database
router.post("/upload-image", uploadProductImage, uploadImageAndSaveToDB);

module.exports = router;
