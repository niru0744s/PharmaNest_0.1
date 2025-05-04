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
    locality:{
        type:String,
        require:true,
    },
    address:{
        type:String,
        require:true,
    },
    city:{
        type:String,
        require:true,
    },
    state:{
        type:String,
        require:true,
    },
    landmark:{
        type:String,
    },
    altNumber:{
        type:Number,
    },
    addressType:{
        type:String,
        require:true,
    },
},{
    timestamps:true,
});

const Address = mongoose.model('Address',newSchema);
module.exports = Address;