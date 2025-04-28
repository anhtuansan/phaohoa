const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const Product = require("../models/Product");

// Cấu hình AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.BUCKET_REGION,
});

// Cấu hình multer để upload ảnh lên S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `products/${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

// Middleware upload ảnh
exports.uploadProductImage = upload.single("image");

// Controller xử lý upload và lưu thông tin vào database
exports.uploadImageAndSaveToDB = async (req, res, next) => {
  try {
    if (!req.file || !req.file.location) {
      const error = new Error("Image upload failed");
      error.status = 400;
      throw error;
    }

    // Lưu URL ảnh vào database
    const { productId } = req.body;
    const product = await Product.findByPk(productId);

    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    product.imageUrl = req.file.location;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded and saved successfully",
      imageUrl: req.file.location,
    });
  } catch (err) {
    console.error("Error uploading image", err);
    next(err); // Chuyển lỗi đến middleware xử lý lỗi
  }
};
