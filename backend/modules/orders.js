const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ,status: {
        type: String,
        enum: ["pending", "shipped", "on_the_way", "delivered", "cancelled"],
        default: "pending"
    },
    totalAmount:{
        type:Number,
        default:0
    }
    ,products:[
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
    }
  ],
  address:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Address"
  }
},{
    timestamps:true
});

const Orders = mongoose.model("Orders" , newSchema);
module.exports = Orders;