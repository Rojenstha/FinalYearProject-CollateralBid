const express = require("express");
const { placeBid, getBiddingHistory, sellProduct, getUserBids, getUserBidsByToken } = require("../controllers/biddingController");
const { protect, isManager, isVerifiedUser } = require("../middleWare/authMiddleWare");
const router = express.Router();

// Route to get user bids by token (protected)
router.get("/user", protect, getUserBidsByToken);

// Route to get user bids by userId
router.get("/user/:userId", getUserBids);

// Route to get bidding history for a specific product
router.get("/:productId", getBiddingHistory);

// Route to sell product (protected)
router.post("/sell", sellProduct);

// Route to place a bid on a product (protected)
router.post("/", protect, isVerifiedUser, placeBid);

module.exports = router;
