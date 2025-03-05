const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: { type: String, unique: true },
    password: String
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel
