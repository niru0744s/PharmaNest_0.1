require('dotenv').config();
const express = require('express');
const app = express();


app.get('/',(req,res)=>{
    res.send("root");
});

app.listen(process.env.PORT,(req,res)=>{
    console.log("App is listening ...");
})