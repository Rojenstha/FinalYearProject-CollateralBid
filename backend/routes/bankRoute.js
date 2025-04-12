const express = require('express');
const router = express.Router();
const {getAllBanks, registerBank, } = require('../controllers/bankController');
const { protect, isAdmin } = require("../middleWare/authMiddleWare")

// Register a new bank
router.post("/register", protect, isAdmin, registerBank);
router.get("/bank", protect, isAdmin,getAllBanks);


module.exports = router;
