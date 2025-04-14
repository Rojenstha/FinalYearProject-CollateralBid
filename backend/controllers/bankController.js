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

const updateBank = async (req, res) => {
  try {
    const { name, code, contact } = req.body;
    
    // Find and update the bank details by its ID
    const updatedBank = await BankModel.findByIdAndUpdate(
      req.params.id,
      { name, code, contact },
      { new: true } // `new: true` ensures we get the updated document
    );
    
    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }
    
    res.json(updatedBank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBank = async (req, res) => {
  try {
    const deletedBank = await BankModel.findByIdAndDelete(req.params.id);

    if (!deletedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.json({ message: "Bank deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { registerBank, getAllBanks, updateBank, deleteBank };
