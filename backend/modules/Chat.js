const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    messages:[
        {
            type:String
        }
    ]
},{
    timestamps:true
});

const Chat = mongoose.model("Chat",newSchema);
module.exports = Chat ;