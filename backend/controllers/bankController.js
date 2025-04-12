const BankModel = require("../models/bank");

const registerBank = async (req, res) => {
  const { name, code, contact } = req.body;

  try {
    const existBank = await BankModel.findOne({ name });
    if (existBank) {
      return res.status(401).json({ error: "Bank already Registered." });
    }

    const bank = new BankModel({ name, code, contact });
    await bank.save();
    res.json({ message: "Bank registered successfully!" });
  } catch (error) {
    res.status(501).json({ error: "Error registering Bank." });
  }
};

const getAllBanks = async (req, res) => {
  try {
    const allBanks = await BankModel.find();
    res.json(allBanks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerBank, getAllBanks };
