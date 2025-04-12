const express = require("express");
const { createProduct } = require("../controllers/productController")
const { protect, isSeller } = require("../middleWare/authMiddleWare")
const { upload } = require("../utils/fileUpload")
const router = express.Router();

router.post("/create", protect, isSeller, upload.single("image"), createProduct);

module.exports = router;