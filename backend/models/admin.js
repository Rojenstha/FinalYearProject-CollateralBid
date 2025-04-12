const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema(
    {
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "admin"},
    commissionBalance: {
        type: Number,
        default: 0,
      },
      balance: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
)

const AdminModel = mongoose.model("admin", AdminSchema)
module.exports = AdminModel