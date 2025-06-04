require('dotenv').config();
const Product = require("../modules/Products");
const initData = require("./data");
const mongoose = require("mongoose");

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
};

main().then(()=>console.log("Database is connected ")).catch((err)=>console.log(err));

const init = async()=>{
    await Product.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,hostId:"68170a057b8cedc13cb47daf"}))
    await Product.insertMany(initData.data);
    console.log("Data inserted ");
}

init();