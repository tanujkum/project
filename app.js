
const express=require("express");
const dotenv=require("dotenv")
const app=express();
const cors = require("cors");
const cookieParser = require('cookie-parser')

dotenv.config({path:'./config.env'})
require('./db/connection')
app.use(cors({
    origin:'*'
}));

app.use(express.json())
app.use(cookieParser())
app.use(require('./router/auth'))



// app.get('/about',middleware,(req,res)=>{
//     res.send("Hello from backend About")
// })

app.get('/contact',(req,res)=>{
    // res.cookie('test','tanuj')
    res.send("Hello from backend Contact")
})

app.get('/signin',(req,res)=>{
    res.send("Hello from backend Signin")
})

app.get('/signup',(req,res)=>{
    res.send("Hello from backend Signup")
})
const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})