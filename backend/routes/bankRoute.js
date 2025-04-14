const express = require('express');
const router = express.Router();
const {getAllBanks, registerBank, updateBank, deleteBank, } = require('../controllers/bankController');
const { protect, isAdmin } = require("../middleWare/authMiddleWare")

// Register a new bank
router.post("/register", registerBank);
router.get("/bank", getAllBanks);

router.put("/:id",updateBank);

router.delete("/del/:id", deleteBank);

module.exports = router;
