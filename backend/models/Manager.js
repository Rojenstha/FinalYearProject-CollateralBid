const mongoose = require('mongoose')

const ManagerSchema = new mongoose.Schema(
    {
    name: String,
    phone: Number,
    bank: String,
    email: String,
    password: String,
    role: {type: String, default: "seller"},
    balance: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
)

const ManagerModel = mongoose.model("Manager", ManagerSchema)
module.exports = ManagerModel