const dotenv = require('dotenv');  // Add this line to load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

const productRoute = require("./routes/productRoute")
const UserModel = require("./models/User");
const ManagerModel = require("./models/Manager");
const MessageModel = require("./models/Message")
const AdminModel = require("./models/admin")

dotenv.config();
const app = express();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());


mongoose.connect("mongodb://localhost:27017/collateralbid_db");

app.use("/api/product", productRoute);
// app.use("/api/bidding", biddingRoute);
// app.use("/api/category", categoryRoute);

app.use("/upload", express.static(path.join(__dirname, "uploads")));

app.post("/register", async (req, res) => {
  console.log("Request Body:", req.body);
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();
        res.json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

app.post("/login", async (req, res) => {
  const { email, password, bank } = req.body;

  try {
    let user;
    let userType = "user"; // default is user

    if (bank) {
      user = await ManagerModel.findOne({ email, bank });
      if (!user) {
        return res.status(403).json({ error: "Invalid Bank Code or Manager not found!" });
      }
      userType = "manager";
    } else {
      user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", 
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      userType
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.status(200).json({ message: "Logged out successfully" });
});



app.post('/message', (req,res)=>{
  MessageModel.create(req.body)
  .then(res.json({message:"Message sent successfully!"}))
  .catch(res.json({error: "Failed to send message!"}))
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password (or app password)
  },
});

app.post('/send-password-reset-email', async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Generate a password reset token (expires in 1 hour)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create the reset password link
    const resetLink = `http://localhost:5000/reset-password?token=${token}`;

    // Send email with the reset link
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded email (you should update their password in the DB here)
    const user = users.find((u) => u.email === decoded.email);

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // In a real app, you'd hash the password before storing it.
    user.password = password; // Update the password (this is just a demo)

    res.json({ success: true, message: 'Password successfully reset' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
});

app.get('/allusers', async(req, res)=>{
  try{
    const allusers = await UserModel.find();
    res.json(allusers);
  }catch(err){
    res.status(500).json({ error: err.message});
  }
})

app.get('/allmessages', async(req,res)=>{
  try{
      const allmessages = await MessageModel.find();
      res.json(allmessages);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
})

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AdminModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userType: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
});

app.post('admin/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists with that email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      email,
      password: hashedPassword,
      name
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin registered successfully!',
      admin: { email: newAdmin.email, name: newAdmin.name }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering admin. Please try again later.' });
  }
});


app.post('admin/registerbank', async (req, res)=>{
    const { name, code, contact } = req.body;
    try{
        const existBank = await BankModel.findOne({ name });
        if (existBank){
            return res.status(401).json({ error: "Bank already Registered."});
        }

        const bank = new BankModel({ name, code, contact});
        await bank.save();
        res.json({ message: "Bank registered successfully!" });
    } catch (error) {
      res.status(501).json({ error: "Error registering Bank." });
    }
})

app.post("admin/registermanager", async (req, res) => {
    const { name, email, password, phone, bank } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const existingUser = await ManagerModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
  
      const user = new ManagerModel({ name, email, bank, phone, password: hashedPassword });
      await user.save();
      res.json({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error registering user" });
    }
  });

app.get("admin/allmanagers", async(req,res)=>{
    try{
        const allmanagers = await ManagerModel.find();
        res.json(allmanagers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.put("admin/managers/:id", async (req, res) => {
    try {
      const { name, phone, bank, email } = req.body;
      const updatedManager = await ManagerModel.findByIdAndUpdate(
        req.params.id,
        { name, phone, bank, email },
        { new: true } // Returns the updated document
      );
      res.json(updatedManager);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.delete("admin/managers/:id", async (req, res) => {
    try {
      await ManagerModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Manager deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.get("admin/allbanks", async(req,res)=>{
    try{
        const allbanks = await BankModel.find();
        res.json(allbanks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});