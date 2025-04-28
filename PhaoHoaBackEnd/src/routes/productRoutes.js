// filepath: PhaoHoaBackEnd/PhaoHoaBackEnd/src/routes/productRoutes.js
const express = require("express");
const { getAllProducts } = require("../controllers/productController");

const router = express.Router();

// Route to get paginated list of fireworks products
router.get("/getall", getAllProducts);

module.exports = router;
