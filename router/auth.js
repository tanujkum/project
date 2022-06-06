
const express=require("express");
const User = require("../model/model");
const bcrypt=require("bcryptjs");
const authenticate=require("../middleware/authenticate");
const router=express.Router();


router.get('/',(req,res)=>{
    console.log("hello from router home")
    res.send("Hello from home")
})

router.post('/register',async(req,res)=>{
    const {name,email,phone,password,cpassword}=req.body;
    if(!name || !email || !phone || !password || !cpassword){
        return res.status(422).json({error:"please Filled the all fields properly"})
    }

    try {
        const userExist=await User.findOne({email:email})
        if(userExist){
            return res.status(422).json({error:"Email already exist"})
        }
        const user=new User({name,email,phone,password,cpassword})
        const registerUser=await user.save()
        if(registerUser){
            return res.status(201).json({message:"User Registered Successfully"})
        }else if(password!=cpassword){
            return res.status(422).json({error:"Password Mismatch"})
        }else{
            return res.status(422).json({error:"Failed to register"})
        }

    } catch (error) {
        console.log(error)
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body;
        
        if(!email || !password){
            return res.status(400).json({error:"please Filled the all fields properly"})
        }
        const userLogin=await User.findOne({email:email})
        if(userLogin){
            const isMatch=await bcrypt.compare(password,userLogin.password)
            const token =await userLogin.generateAuthToken()
            const date=new Date(Date.now()+2592000000)
            res.cookie("jwtoken",token,{
                expires:date,
                httpOnly:true
            });
            
            if(!isMatch){
                res.status(400).json({error:"Invalid Details"});
            }else{
                res.status(201).json({message:"SignedIn Successfully"});
            }
            
        }else{
            return res.status(400).json({message:"User Error"})
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser)
})

router.get('/contact',authenticate,(req,res)=>{
    res.send(req.rootUser)
})

router.post('/contact1',authenticate,async(req,res)=>{
    try {
        const {name,email,phone,message}=req.body;
        if(!name || !email || !phone || !message){
            // console.log("error in form")
            return res.status(399).json({error:"Please fill all fields"})
        }
        const userData=await User.findOne({_id:req.userID})
        if(userData){
            const myMessage=await userData.addMessage(name,email,phone,message)
            await userData.save();
            res.status(201).json({message:"User contacted successfully"})
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/logout',(req,res)=>{
    res.clearCookie('jwtoken',{ path :'/'});
    res.status(200).send("user Logged-out")
 });

module.exports=router;