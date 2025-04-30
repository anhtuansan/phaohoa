const qs = require("qs");
const crypto = require("crypto");

exports.createPaymentUrl = (req, res) => {
  const { amount, orderId, orderInfo, returnUrl } = req.body;

  const vnp_TmnCode = process.env.VNP_TMN_CODE; // Lấy từ file .env
  const vnp_HashSecret = process.env.VNP_HASH_SECRET; // Lấy từ file .env
  const vnp_Url = process.env.VNP_URL; // Lấy từ file .env

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId, // Mã đơn hàng
    vnp_OrderInfo: orderInfo, // Thông tin đơn hàng
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100, // Số tiền (VNPay yêu cầu tính bằng đồng, nhân 100)
    vnp_ReturnUrl: returnUrl, // URL trả về sau khi thanh toán
    vnp_IpAddr: req.ip, // Địa chỉ IP của người dùng
    vnp_CreateDate: new Date().toISOString().replace(/[-T:\.Z]/g, ""), // Thời gian tạo giao dịch
  };

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  // Tạo chuỗi query string
  const signData = qs.stringify(sortedParams, { encode: false });

  // Tạo chữ ký (signature)
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Thêm chữ ký vào URL
  const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${signed}`;

  res.status(200).json({ paymentUrl });
};

exports.returnPayment = (req, res) => {
  const vnp_HashSecret = process.env.VNP_HASH_SECRET; // Lấy từ file .env
  const vnp_Params = req.query;

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  // Tạo chữ ký để xác minh
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    // Xác minh thành công
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: vnp_Params,
    });
  } else {
    // Xác minh thất bại
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};
