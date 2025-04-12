const ManagerModel = require("../models/Manager");
const bcrypt = require("bcryptjs");

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

module.exports = { registerManager, getAllManagers, updateManager, deleteManager };
