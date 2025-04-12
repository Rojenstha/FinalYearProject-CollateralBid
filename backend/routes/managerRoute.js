const express = require('express');
const router = express.Router();
const { registerManager, updateManager, deleteManager, getAllManagers } = require('../controllers/managerController');
const { protect, isAdmin } = require("../middleWare/authMiddleWare")

router.get("/allmanagers", protect, isAdmin,getAllManagers);

router.post("/register", protect, isAdmin,registerManager);

router.put("/:id", protect, isAdmin,updateManager);

router.delete("/del/:id", protect, isAdmin,deleteManager);

module.exports = router;
