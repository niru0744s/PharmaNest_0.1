const mongoose = require('mongoose');
const newSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    phoneNumber:{
        type:String,
        require:true
    },
    password:{
        type:String,
    },
    otp:{
        type:String,
    },
    token:{
        type:String,
    },
    purchased:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    locations:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
},{
    timestamps:true
})

const User = mongoose.model("User",newSchema);
module.exports = User;