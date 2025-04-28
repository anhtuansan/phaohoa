// filepath: d:\Project\PhaoHoaBackEnd\src\controllers\productController.js
const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const totalProducts = await Product.count();
    const products = await Product.findAll({
      limit: limit,
      offset: offset,
    });

    res.json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (err) {
    console.error("Error fetching products", err);
    next(err); // Chuyển lỗi đến middleware xử lý lỗi
  }
};
