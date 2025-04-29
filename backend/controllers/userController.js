const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail")

const UserModel = require("../models/User");
const ManagerModel = require("../models/Manager");

const userRegister = async (req, res) => {
  console.log("Request Body:", req.body);
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new UserModel({ name, email, phone, password: hashedPassword });
    await user.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password." });
  }

  let user = await UserModel.findOne({ email });
  let role = "buyer";

  if (!user) {
    user = await ManagerModel.findOne({ email });
    role = "seller";
  }

  if (!user) {
    return res.status(404).json({ error: "User not found. Please sign up." });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  const token = generateToken(user._id, user.role || role);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  const { _id, name, email: userEmail, phone } = user;

  res.status(200).json({
    _id,
    name,
    email: userEmail,
    phone,
    role: user.role || role,
    token,
  });
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

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    let user = await UserModel.findOne({ email });
    let manager = await ManagerModel.findOne({ email });
  
    if (!user && !manager) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const resetToken = crypto.randomBytes(32).toString("hex");
  
    if (user) {
      user.resetPasswordToken = resetToken;
      await user.save();
    }
    if (manager) {
      manager.resetPasswordToken = resetToken;
      await manager.save();
    }
  
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
    const message = `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset it:</p>
      <a href="${resetURL}">Reset Password</a>
    `;
  
    try {
      if (user) {
        await sendEmail({
          email: user.email,
          subject: "Password Reset Request",
          message,
        });
      }
      if (manager) {
        await sendEmail({
          email: manager.email,
          subject: "Password Reset Request",
          message,
        });
      }
  
      res.status(200).json({ message: "Reset link sent to email." });
    } catch (err) {
      if (user) {
        user.resetPasswordToken = undefined;
        await user.save();
      }
      if (manager) {
        manager.resetPasswordToken = undefined;
        await manager.save();
      }
  
      res.status(500).json({ message: "Email could not be sent" });
    }
  };
  
  
  
  const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    let user = await UserModel.findOne({ resetPasswordToken: token });
    let manager = await ManagerModel.findOne({ resetPasswordToken: token });
  
    if (!user && !manager) {
      return res.status(400).json({ message: "Token is invalid" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    if (user) {
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      await user.save();
    }
    if (manager) {
      manager.password = hashedPassword;
      manager.resetPasswordToken = undefined;
      await manager.save();
    }
  
    res.status(200).json({ message: "Password reset successful" });
  };
  
  
  const deleteUser = async (req, res) => {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.json({ message: "User has been deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const AllVerifiedUsers = async (req, res) => {
    try {
      const verifiedUsers = await UserModel.find({ isVerified: true });
  
      res.status(200).json({
        message: "Verified users fetched successfully",
        data: verifiedUsers
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const unverifyUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.isVerified === false) {
        return res.status(400).json({ message: "User is already unverified" });
      }
  
      user.isVerified = false;
      await user.save();
  
      res.status(200).json({ message: "User successfully unverified", data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateUser = async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
  
      // Check if the user ID exists
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update fields if they are provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = bcrypt.hash(password, 10);
      if (phone) user.phone = phone;
  
      // Save the updated user
      await user.save();
  
      res.json({ message: "User details updated successfully", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  const getCurrentUser = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (err) {
      console.error("getCurrentUser error:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  };
  
  
module.exports={
    userRegister,
    userLogin,
    allUsers,
    verifyUser,
    forgotPassword,
    resetPassword,
    deleteUser,
    AllVerifiedUsers,
    unverifyUser,
    updateUser,
    getCurrentUser,
 
}