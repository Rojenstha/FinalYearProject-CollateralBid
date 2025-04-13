const express = require('express');
const router = express.Router();
const { userLogin, userRegister, allUsers, verifyUser, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect, isAdmin } = require("../middleWare/authMiddleWare")


router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/users", protect, isAdmin, allUsers);
router.patch("/verify/:id", protect, isAdmin, verifyUser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
