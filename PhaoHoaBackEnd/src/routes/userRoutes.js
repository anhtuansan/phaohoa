// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware"); // Import verifyToken middleware

router.get("/profile", verifyToken, userController.profile);
router.post("/savelocation", userController.saveUserLocation);

module.exports = router;
