const ManagerModel = require("../models/Manager");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");

const registerManager = async (req, res) => {
  const { name, email, password, phone, bank } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await ManagerModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new ManagerModel({ name, email, bank, phone, password: hashedPassword });
    await user.save();
    res.json({ message: "Manager registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering manager" });
  }
};

const getAllManagers = async (req, res) => {
  try {
    const allManagers = await ManagerModel.find();
    res.json(allManagers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateManager = async (req, res) => {
  try {
    const { name, phone, bank, email } = req.body;
    const updatedManager = await ManagerModel.findByIdAndUpdate(
      req.params.id,
      { name, phone, bank, email },
      { new: true }
    );
    res.json(updatedManager);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteManager = async (req, res) => {
  try {
    await ManagerModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Manager deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotBank = async (req, res) => {
  const { email } = req.body;
  console.log("Now:", new Date(Date.now()));

  // Find the manager by email
  const manager = await ManagerModel.findOne({ email });

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log("Generated Reset Token:", resetToken);

  // Save the reset token and expiration time for the manager
  manager.resetPasswordToken = resetToken;
  manager.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await manager.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-bank/${resetToken}`;

  const message = `
    <h1>Bank Reset</h1>
    <p>You requested a bank reset. Click the link below to reset it:</p>
    <a href="${resetURL}">Reset Bank</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  try {
    // Send the email to the manager
    await sendEmail({
      email: manager.email,
      subject: "Bank Reset Request",
      message,
    });

    res.status(200).json({ message: "Bank reset link sent to email." });
  } catch (err) {
    manager.resetPasswordToken = undefined;
    manager.resetPasswordExpire = undefined;
    await manager.save();
    res.status(500).json({ message: "Email could not be sent" });
  }
};

const resetBank = async (req, res) => {
  const { token } = req.params;
  const { bank } = req.body;

  // Find the manager by reset token and check if the token is still valid
  const manager = await ManagerModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }, // Ensure token is not expired
  });

  if (!manager) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  // Reset the bank information for the manager
  manager.bank = bank;
  manager.resetPasswordToken = undefined;
  manager.resetPasswordExpire = undefined;

  await manager.save();

  res.status(200).json({ message: "Bank details reset successful" });
};

module.exports = { registerManager, getAllManagers, updateManager, deleteManager,
  forgotBank,
  resetBank
 };
