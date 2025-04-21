require('dotenv').config();
const express = require('express');
const app = express();
const Cors = require('cors');
const mongoose = require('mongoose');

app.use(express.json());
app.use(Cors());

async function Main(){
    await mongoose.connect(process.env.MONGO_URI)
}

Main().then(()=>console.log("Database is connected")).catch((err)=>console.log(err));

app.get('/',(req,res)=>{
    res.send("root");
});

app.listen(process.env.PORT,(req,res)=>{
    console.log("App is listening ...");
})