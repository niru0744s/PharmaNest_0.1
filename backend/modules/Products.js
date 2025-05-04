const mongoose = require("mongoose");
const Review = require("./reviews");
const User = require("./User");


const newSchema = mongoose.Scheman({
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
    category:{
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
        url:String,
        filename:String
    },
    quantity:{
        type:Number,
        require:true,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    hostId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Host"
        }
},{
    timestamps:true
});

newSchema.post("findOneAndDelete", async(Product)=>{
    if(Product){
        await Review.deleteMany({reviews: {$in: Product.reviews}});
    }
});

newSchema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await User.updateMany(
            {purchased: doc._id},
            {$pull: {purchased: doc._id}}
        );
    }
});


const Product = mongoose.model("Product",newSchema);
module.exports = Product;