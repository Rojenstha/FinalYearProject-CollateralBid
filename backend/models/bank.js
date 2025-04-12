const mongoose = require('mongoose')

const BankSchema = new mongoose.Schema({
    name: String,
    code: String, 
    contact: Number
})

const BankModel = mongoose.model("bank", BankSchema)
module.exports = BankModel