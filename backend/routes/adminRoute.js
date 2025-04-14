const express = require("express");
const router = express.Router();
const { adminLogin, adminRegister } = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleWare/authMiddleWare")

router.post("/cb-login", adminLogin);
router.post("/cb-register", adminRegister);

module.exports = router;
