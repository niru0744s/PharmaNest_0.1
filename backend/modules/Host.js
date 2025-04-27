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
    phNumber:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"products",
        }
    ]
},{
    timestamps:true
});

const host = mongoose.model('host',newSchema);
module.exports = host;