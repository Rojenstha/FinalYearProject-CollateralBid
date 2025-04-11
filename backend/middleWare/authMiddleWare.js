const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ManagerModel = require("../models/Manager")
const AdminModel = require("../models/admin") 

const protect = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, userType } = decoded;

    let user;
    if (userType === "manager") {
      user = await ManagerModel.findById(id).select("-password");
    } else {
      user = await User.findById(id).select("-password");
    }

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    req.userType = userType;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});


const isAdmin = expressAsyncHandler(async (req, res, next) => {
  try {
    const admin = await AdminModel.findOne({ userId: req.user._id });
    if (!admin) {
      res.status(403);
      throw new Error("Access denied. You are not an admin.");
    }
    next();
  } catch (error) {
    res.status(403);
    throw new Error("Access denied. You are not an admin.");
  }
});

const isSeller = (req, res, next) => {
  if (req.userType === "manager") {
    return next();
  }
  res.status(403);
  throw new Error("Access denied. Only managers allowed.");
};

module.exports = { protect, isAdmin, isSeller };