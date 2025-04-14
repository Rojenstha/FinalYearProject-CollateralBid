const express = require('express');
const router = express.Router();
const { registerManager, updateManager, deleteManager, getAllManagers, forgotBank, resetBank } = require('../controllers/managerController');
const { protect, isAdmin } = require("../middleWare/authMiddleWare")

router.get("/allmanagers",getAllManagers);
router.post("/forgot-bank", forgotBank);
router.post("/reset-bank/:token", resetBank);


router.post("/register", registerManager);

router.put("/:id",updateManager);

router.delete("/del/:id", deleteManager);

module.exports = router;
