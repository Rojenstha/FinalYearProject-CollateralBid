const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail")

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

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("Now:", new Date(Date.now()));
  
    // Check for User and Manager models
    let user = await UserModel.findOne({ email });
    let manager = await ManagerModel.findOne({ email });
  
    if (!user && !manager) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated Reset Token:", resetToken);
  
    // Set the reset token and expiration for user or manager
    if (user) {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      await user.save();
    }
    if (manager) {
      manager.resetPasswordToken = resetToken;
      manager.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      await manager.save();
    }
  
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
    const message = `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset it:</p>
      <a href="${resetURL}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `;
  
    try {
      // Send reset email to the appropriate user or manager
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
        user.resetPasswordExpire = undefined;
        await user.save();
      }
      if (manager) {
        manager.resetPasswordToken = undefined;
        manager.resetPasswordExpire = undefined;
        await manager.save();
      }
  
      res.status(500).json({ message: "Email could not be sent" });
    }
  };
  
  
  const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    // Find user or manager with valid token and expiration
    let user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    let manager = await ManagerModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user && !manager) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    if (user) {
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    if (manager) {
      manager.password = hashedPassword;
      manager.resetPasswordToken = undefined;
      manager.resetPasswordExpire = undefined;
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
      const { id } = req.user;
      const { userType } = req;
  
      let user;
      if (userType === "manager") {
        user = await ManagerModel.findById(id).select("-password");
      } else if (userType === "admin") {
        user = await AdminModel.findById(id).select("-password");
      } else {
        user = await UserModel.findById(id).select("-password");
      }
  
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