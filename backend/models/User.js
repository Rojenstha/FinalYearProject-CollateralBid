const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: { type: String, unique: true },
    password: String,
    role: {type: String, default: "buyer"}
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel
