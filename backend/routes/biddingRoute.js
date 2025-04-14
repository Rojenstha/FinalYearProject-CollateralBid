const express = require("express");
const { placeBid, getBiddingHistory, sellProduct, getUserBids, getUserBidsByToken } = require("../controllers/biddingController");
const { protect, isManager, isVerifiedUser } = require("../middleWare/authMiddleWare");
const router = express.Router();


router.get("/user", protect, getUserBidsByToken);
router.get("/user/:userId", getUserBids); 
router.get("/:productId", getBiddingHistory);
router.post("/sell", sellProduct);
router.post("/", protect, placeBid);



module.exports = router;