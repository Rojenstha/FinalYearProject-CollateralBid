const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get list of unique companies
router.get("/", async (req, res) => {
    try {
        const companies = await User.distinct("company");
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
