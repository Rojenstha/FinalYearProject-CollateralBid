const express = require("express");
const { createProduct } = require("../controllers/productController")
const { protect, isSeller } = require("../middleWare/authMiddleWare")
const router = express.Router();

router.post("/create", protect, isSeller, createProduct);

module.exports = router;