const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    quantity:{
        type:Number,
        default:0
    },
    products:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
},{
    timestamps:true,
})

const Cart = mongoose.model("Cart",newSchema);
module.exports = Cart;