require('dotenv').config();  // Add this line to load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("./models/User");
const ManagerModel = require("./models/Manager");
const MessageModel = require("./models/Message")

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/collateralbid_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
