const Product = require("../modules/Products");
const initData = require("./data");
const mongoose = require("mongoose");

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
};

main().then(()=>console.log("Database is connected ")).catch((err)=>console.log(err));

const init = async()=>{
    await Product.deleteMany({});
    await Product.insertMany(initData.data);
    console.log("Data inserted ");
}