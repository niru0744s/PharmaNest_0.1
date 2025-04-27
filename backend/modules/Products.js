const mongoose = require("mongoose");

const newSchema = mongoose.Scheman({
    id:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true,
    },
    brand:{
        type:String,
        require:true,
    },
    form:{
        type:String,
        require:true,
    },
    strength:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    quantity:{
        type:Number,
        require:true,
    },
    hostId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"host"
        }
    ]
},{
    timestamps:true
});

const product = mongoose.model("product",newSchema);
module.exports = product;