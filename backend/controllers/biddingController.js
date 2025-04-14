const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")
const BiddingProduct = require("../models/biddingModel")
const AdminModel = require("../models/admin")
const ManagerModel = require("../models/Manager")
const User = require("../models/User")
const sendEmail = require("../utils/sendEmail")

const getBiddingHistory = asyncHandler(async(req, res) => {
  const { productId } = req.params;

  const biddingHistory = await BiddingProduct.find({ product: productId }).sort("-createdAt").populate("user").populate("product");

  res.status(200).json(biddingHistory);
});

const placeBid = async (req, res) => {
  const { id: productId } = req.params;
  const { price } = req.body;
  const userId = req.user._id; // assuming auth middleware adds user

  try {
    // Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional: Prevent bidding if product is sold
    if (product.isSoldOut) {
      return res.status(400).json({ message: "This product is sold out." });
    }

    // Ensure new bid is higher than current bid/price
    const minBid = product.currentBid ?? product.price;
    if (price <= minBid) {
      return res.status(400).json({ message: "Your bid must be higher than the current bid." });
    }

    // Save new bid
    const bid = new BiddingProduct({
      user: userId,
      product: productId,
      price,
    });
    await bid.save();

    // Update product's currentBid and increment bid count
    product.currentBid = price;
    product.bids = product.bids + 1;
    await product.save();

    res.status(200).json({ message: "Bid placed successfully", bid });
  } catch (err) {
    console.error("Bid error:", err);
    res.status(500).json({ message: "Server error while placing bid" });
  }
};

const sellProduct = asyncHandler(async(req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  //   /* const currentTime = new Date();
  //   const tenMinutesAgo = new Date(currentTime - 2 * 60 * 1000); // 10 minutes ago

  //     if (!product.isSoldout || product.updatedAt < tenMinutesAgo || product.createdAt < tenMinutesAgo) {
  //     return res.status(400).json({ error: "Product cannot be sold at this time" });
  //   } */

  // Check if the user is authorized to sell the product
  if (product.user.toString() !== userId) {
    return res.status(403).json({ error: "You do not have permission to sell this product" });
  }

  // Find the highest bid
  const highestBid = await BiddingProduct.findOne({ product: productId }).sort({ price: -1 }).populate("user");
  if (!highestBid) {
    return res.status(400).json({ error: "No winning bid found for the product" });
  }

  // Calculate commission and final price
  const commissionRate = product.commission;
  const commissionAmount = (commissionRate / 100) * highestBid.price;
  const finalPrice = highestBid.price - commissionAmount;

  // Update product details
  product.isSoldOut = true;
  product.soldTo = highestBid.user_id;
  product.soldPrice = finalPrice;

  // Update admin's commission balance
  const admin = await AdminModel.findOne({ role: "admin" });
  if (admin) {
    admin.commissionBalance += commissionAmount;
    await admin.save();
  }

  // Update seller's balance
  const seller = await ManagerModel.findById(product.user);
  if (seller) {
    seller.balance += finalPrice; // Add the remaining amount to the seller's balance
    await seller.save();
  } else {
    return res.status(404).json({ error: "Seller not found" });
  }

  // Save product
  await product.save();

  await sendEmail({
    email: highestBid.user.email,
    subject: "Congratulations! You won the auction!",
    html: `You have won the auction for "${product.title}" with a bid of $${highestBid.price}.`,
  });

  res.status(200).json({ message: "Product has been successfully sold!" });
});

const test = asyncHandler(async(req, res) => {
  res.send("test")
});

const getUserBiddingHistory = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const bids = await BiddingProduct.find({ user: user._id })
    .populate("product")
    .sort({ createdAt: -1 });

  res.status(200).json(bids);
});

const getUserWinningBids = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const products = await Product.find({ soldTo: user._id })
    .populate("soldTo")
    .sort({ updatedAt: -1 });

  res.status(200).json(products);
});

const getUserBids = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const bids = await BiddingProduct.find({ user: userId })
    .sort("-createdAt")
    .populate("product");

  const winningBids = await Product.find({ soldTo: userId });

  res.status(200).json({
    bids,
    winningBids,
  });
});

const getUserBidsByToken = async (req, res) => {
  try {
    const userId = req.user._id; // Provided by the `protect` middleware
    const bids = await BiddingProduct.find({ user: userId }).populate("product");
res.json(bids);

  } catch (error) {
    console.error("Error fetching user bids:", error);
    res.status(500).json({ message: "Failed to fetch user bids" });
  }
};



module.exports = {
  getBiddingHistory,
  placeBid,
  sellProduct,
  getUserBiddingHistory,
  getUserWinningBids,
  getUserBids,
  getUserBidsByToken, 
};
