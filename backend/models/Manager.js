const mongoose = require('mongoose')

const ManagerSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    bank: String,
    email: String,
    password: String,
    role: {type: String, default: "seller"},
})

const ManagerModel = mongoose.model("Manager", ManagerSchema)
module.exports = ManagerModel