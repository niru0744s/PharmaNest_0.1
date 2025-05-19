const mongoose = require('mongoose');

const newSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    mobileNum:{
        type:Number,
        require:true,
    },
    pincode:{
        type:Number,
        require:true,
    },
    address:{
        type:String,
        require:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true,
});

const Address = mongoose.model('Address',newSchema);
module.exports = Address;