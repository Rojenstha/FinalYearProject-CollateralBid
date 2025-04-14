const express = require("express");
const { createProduct, getAllProducts, deleteProduct, updateProduct, getAllProductsofUser, verifyAndAddCommissionProductByAdmin, getAllProductsByAdmin, deleteProductsByAdmin, getProduct, getAllSoldProducts } = require("../controllers/productController")
const { protect, isManager, isAdmin } = require("../middleWare/authMiddleWare")
const { upload } = require("../utils/fileUpload")
const router = express.Router();

router.get("/", getAllProducts);
router.get("/sold", protect, isManager, getAllSoldProducts);
router.get("/manager", protect, isManager,getAllProductsofUser);

router.get("/admin/products", protect, isAdmin, getAllProductsByAdmin);
router.patch("/admin/product-verified/:id", protect, isAdmin, verifyAndAddCommissionProductByAdmin);
router.delete("/admin/", protect, isAdmin, deleteProductsByAdmin);

router.get("/:id", getProduct);

router.post("/create", protect, isManager, upload.single("image"), createProduct);
router.delete("/:id", protect, isManager, deleteProduct);
router.put("/:id", protect, isManager, upload.single("image"), updateProduct);


module.exports = router;