const express = require('express');
const router = express.Router();
const { userLogin, userRegister, allUsers, verifyUser } = require('../controllers/userController');
const { protect, isAdmin } = require("../middleWare/authMiddleWare")


router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/users", protect, isAdmin, allUsers);
router.patch("/verify/:id", protect, isAdmin, verifyUser)

module.exports = router;
