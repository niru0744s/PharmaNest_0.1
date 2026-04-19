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

// Indexes for cart item lookup/update paths
newSchema.index({ UserId: 1, products: 1 });
newSchema.index({ UserId: 1, createdAt: -1 });

const Cart = mongoose.model("Cart",newSchema);
module.exports = Cart;
