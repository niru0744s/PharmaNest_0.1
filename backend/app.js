require('dotenv').config();
const express = require('express');
const app = express();
const Cors = require('cors');
const mongoose = require('mongoose');
const AuthRoute = require('./routes/userAuth');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(Cors());
app.use("/api/v1/auth",AuthRoute);

async function Main(){
    await mongoose.connect(process.env.MONGO_URI)
}

Main().then(()=>console.log("Database is connected")).catch((err)=>console.log(err));

app.get('/api/v1/',(req,res)=>{
    res.send("root");
});

app.listen(process.env.PORT,(req,res)=>{
    console.log("App is listening ...");
})