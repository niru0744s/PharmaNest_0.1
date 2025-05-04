const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
    comment:{
        type:String,
        require:true,
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Review",newSchema);