const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    phone: Number,
    role: {
      type: String,
      default: "buyer",
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel
