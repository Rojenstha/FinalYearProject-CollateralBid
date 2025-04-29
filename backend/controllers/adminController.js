const AdminModel = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
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
      { id: user._id, role: "admin" }, // match 'role' key
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
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
};

const adminRegister = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  try {
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists with that email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      email,
      password: hashedPassword,
      name
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully!",
      admin: { email: newAdmin.email, name: newAdmin.name }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering admin. Please try again later." });
  }
};



module.exports = { adminLogin, adminRegister };
