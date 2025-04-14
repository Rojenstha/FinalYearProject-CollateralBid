const { getUserBiddingHistory, getUserWinningBids } = require("../controllers/biddingController")

const express = require('express');
const router = express.Router();
const { userLogin, userRegister, allUsers, verifyUser, forgotPassword, resetPassword, deleteUser, AllVerifiedUsers, unverifyUser, updateUser, getCurrentUser } = require('../controllers/userController');
const { protect, isAdmin } = require("../middleWare/authMiddleWare")

router.post("/register", userRegister);
router.post("/login", userLogin);

router.get("/user", protect, getCurrentUser);

router.get("/history/:email", getUserBiddingHistory);
router.get("/winning/:email", getUserWinningBids);


router.get("/users", allUsers);
router.patch("/verify/:id", verifyUser)
router.get("/verifiedusers", AllVerifiedUsers);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.patch("/unverify/:id", unverifyUser)

router.put("/:id",updateUser);
router.delete("/del/:id", deleteUser);

module.exports = router;
