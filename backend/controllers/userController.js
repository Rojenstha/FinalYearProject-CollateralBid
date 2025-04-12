const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User");
const ManagerModel = require("../models/Manager");

const userRegister = async (req, res) => {
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
};

const userLogin = async (req, res) => {
  const { email, password, bank } = req.body;

  try {
    let user;
    let userType = "user";

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
};

const allUsers = async(req, res)=>{
    try{
      const allusers = await UserModel.find();
      res.json(allusers);
    }catch(err){
      res.status(500).json({ error: err.message});
    }
  }

  const verifyUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.isVerified === true) {
        return res.status(400).json({ message: "User is already verified" });
      }
  
      user.isVerified = true;
      await user.save();
  
      res.status(200).json({ message: "User successfully verified", data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports={
    userRegister,
    userLogin,
    allUsers,
    verifyUser
}