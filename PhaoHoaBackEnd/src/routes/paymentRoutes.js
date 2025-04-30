const express = require("express");
const {
  createPaymentUrl,
  returnPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Route để tạo URL thanh toán
router.post("/create-payment-url", createPaymentUrl);

// Route để xử lý kết quả thanh toán
router.get("/return-payment", returnPayment);

module.exports = router;
