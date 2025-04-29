const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Manager",
    },
    title:{
        type: String,
        required: [true, "Please add a title"],
        trim: true,
    },
    description:{
        type: String,
        required: [true, "Please add a description"],
    },
    image:{
        type: Object,
        default: {},
    },
    category:{
        type: String,
        required: [true, "Please add a category"],
        default: "All",
        enum: ["Land", "Land and Building", "All"]
    },
    commission:{
        type: Number,
        default: 0,
    },
    price:{
        type: Number,
        required: [true, "Please add a price"],
    },
    city: { type: String, required: [true, "Please enter the city"]},
    startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
      minimumIncrement: {
        type: Number,
        default: 1000, 
      },
      maximumIncrement: {
        type: Number,
        default: 10000, 
      },
      
      reservePrice: {
        type: Number,
      },
      currentBid: {
        type: Number,
        default: 0,
      },
      auctionStatus: {
        type: String,
        enum: ["notStarted", "ongoing", "ended", "sold"],
        default: "notStarted",
      },      
      bids: {
        type: Number,
        default: 0,
      },      
    isVerify: { type: Boolean, default: false},
    isSoldOut: { type: Boolean, default: false},
    soldTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;