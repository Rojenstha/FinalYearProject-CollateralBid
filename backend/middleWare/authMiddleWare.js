const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ManagerModel = require("../models/Manager");
const AdminModel = require("../models/admin");

const protect = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded; 

    let user;
    if (role === "seller") {
      user = await ManagerModel.findById(id).select("-password");
    } else if (role === "admin") {
      user = await AdminModel.findById(id).select("-password");
    } else {
      user = await User.findById(id).select("-password");
    }

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    req.userType = role;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

const isVerifiedUser = (req, res, next) => {
  if (req.user?.isVerified === true) {
    return next();
  }
  res.status(403);
  throw new Error("Access denied. Only verified users allowed.");
};


const isAdmin = expressAsyncHandler(async (req, res, next) => {
  if (req.userType !== "admin") {
    res.status(403);
    throw new Error("Access denied. You are not an admin.");
  }
  next();
});

const isManager = (req, res, next) => {
  if (req.userType === "seller") {
    return next();
  }
  res.status(403);
  throw new Error("Access denied. Only managers allowed.");
};

module.exports = { protect, isAdmin, isManager, isVerifiedUser};
