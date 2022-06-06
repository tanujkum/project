const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    messages:[{
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            
        },
        phone:{
            type:String,
            required:true,
        },
        message:{
            type:String,
            required:true
        }
    }],
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12)
        this.cpassword=await bcrypt.hash(this.cpassword,12)
    }
    next();
})
userSchema.methods.generateAuthToken=async function(){
    try {
        let myToken=await jwt.sign({_id:this._id},process.env.SECRETKEY)
        this.tokens=this.tokens.concat({token:myToken})
        await this.save()
        return myToken
    } catch (error) {
        console.log(error)
    }
}
userSchema.methods.addMessage=async function(name,email,phone,message){
    try {
        this.messages=this.messages.concat({name,email,phone,message})
        await this.save();
        return this.messages;
    } catch (error) {
        console.log(error)
    }
}
const User=new mongoose.model('USER',userSchema)
module.exports=User;