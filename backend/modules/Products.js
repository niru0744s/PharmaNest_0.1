const mongoose = require("mongoose");
const Review = require("./reviews");
const User = require("./User");


const newSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    form:{
        type:String,
        required:true,
    },
    strength:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:["Medicine","OTC_Medicine","First_Aid","Hygiene","Baby_product","Supplements","Test_kits"],
        required:true,
    },
    mainPrice:{
        type:Number,
        require:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:0,
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