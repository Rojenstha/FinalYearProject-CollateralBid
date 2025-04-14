const dotenv = require('dotenv');  // Add this line to load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const managerRoute = require("./routes/managerRoute");
const bankRoute = require("./routes/bankRoute");
const messageRoute = require("./routes/messageRoute");
const productRoute = require("./routes/productRoute")
const biddingRoute = require("./routes/biddingRoute")
const categoryRoute = require("./routes/categoryRoute")

dotenv.config();
const app = express();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.use(express.json());
app.use(cookieParser());


mongoose.connect("mongodb://localhost:27017/collateralbid_db");

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/manager", managerRoute);
app.use("/api/bank", bankRoute);
app.use("/api/message", messageRoute);

app.use("/api/product", productRoute);
app.use("/api/bidding", biddingRoute);
app.use("/api/category", categoryRoute);

app.use("/upload", express.static(path.join(__dirname, "uploads")));

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});