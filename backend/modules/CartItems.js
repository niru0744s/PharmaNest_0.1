const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    products:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products"
    },
},{
    timestamps:true,
})

const Cart = mongoose.model("Cart",newSchema);
module.exports = Cart;