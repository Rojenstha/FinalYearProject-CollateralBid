const dotenv = require('dotenv');  // Add this line to load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const UserModel = require("./models/User");
const ManagerModel = require("./models/Manager");
const MessageModel = require("./models/Message")

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/collateralbid_db");

app.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new UserModel({ name, email,phone, password: hashedPassword });
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
    let isManager = false;

    if (bank) {
      user = await ManagerModel.findOne({ email, bank });
      if (!user) {
        return res.status(403).json({ error: "Invalid Bank Code or Manager not found!" });
      }
      isManager = true;
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
      { id: user._id, isManager },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, isManager });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
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


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
