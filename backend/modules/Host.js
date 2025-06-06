const mongoose = require("mongoose");

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
    token:{
        type:String,
    },
    otp:{
        type:Number
    },
    password:{
        type:String,
    },
    operator:{
        type:"String",
        default:"host",
    }
},{
    timestamps:true
});

const Host = mongoose.model('Host',newSchema);
module.exports = Host;