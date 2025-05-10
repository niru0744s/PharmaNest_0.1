const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ,status: {
        type: String,
        enum: ["pending", "shipped", "on_the_way", "delivered", "cancelled", "return"],
        default: "pending"
    }
    ,product:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Cart"
        }
},{
    timestamps:true
});

const Oders = mongoose.model("Orders" , newSchema);