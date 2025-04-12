const express = require("express");
const { placeBid, getBiddingHistory, sellProduct } = require("../controllers/biddingController");
const { protect, isManager, isVerifiedUser } = require("../middleWare/authMiddleWare");
const router = express.Router();

router.get("/:productId", getBiddingHistory);
router.post("/sell", protect, isManager, sellProduct);
router.post("/", protect, isVerifiedUser, placeBid);

module.exports = router;