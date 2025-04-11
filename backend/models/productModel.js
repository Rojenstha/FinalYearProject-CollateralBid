const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
    },
    title:{
        type: String,
        require: [true, "Please add a title"],
        trime: true,
    },
    description:{
        type: String,
        require: [true, "Please add a description"],
        unique: true,
    },
    image:{
        type: Object,
        default: {},
    },
    category:{
        type: String,
        require: [true, "Please add a category"],
        default: "All",
    },
    commission:{
        type: Number,
        default: 0,
    },
    price:{
        type: Number,
        require: [true, "Please add a price"],
    },
    height: { type: Number},
    lengthPic: { type: Number},
    Width: { type: Number},
    mediumused: { type: String},
    isVerify: { type: Boolean, default: false},
    isSoldOut: { type: Boolean, default: false},
    soldTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;