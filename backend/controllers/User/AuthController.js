const User = require('../../modules/User');
const {randomInt} = require('crypto');
const bcrypt = require('bcrypt');
const jwtToken = require('../../middleware/tokenVerify');

module.exports.otpSent = async (req,res)=>{
    try {
        const {email} = req.body;
        const exstUser = await User.findOne({email:email});
        if(exstUser){
            res.send({
                success:0,
                message:"User is already registered , Try to login !"
            })
        }
        const otp = randomInt(1000,10000);
        const newUSr = await new User({
            email:email,
            otp:otp
        }).save();
        setTimeout(async ()=>{
            const newOtp = randomInt(1000,10000);
            await User.findByIdAndUpdate(newUSr._id,{
            otp:newOtp
            });
        },10*60*1000)
        res.send({
            success:1,
            message:"OTP sent successfully ! , will valid for 10 min",
            newUSr
        });
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.otpVerify = async(req,res)=>{
    try {
    const {id} = req.query;
    const {otp} = req.body;
    const exUser = await User.findById(id);
    if(otp != exUser.otp){
        res.send({
            success:0,
            message:"Wrong OTP , Try again !"
        })
    }
    res.send({
        success:1,
        message:"OTP verification Successfull !"
    });
    } catch (error) {
        res.send({
            success:0,
            message:error
        }) 
    }
}

module.exports.createPass = async(req,res)=>{
    try {
        const {firstName , lastName , phoneNumber , pass} = req.body;
        const {id} = req.query;
        const empass = await bcrypt.hash(pass,10);
        const newUser = await User.findByIdAndUpdate(id,{
            firstName,
            lastName,
            phoneNumber,
            password:empass
        });
        console.log(newUser);
        res.send({
            success:1,
            message:"Password has updated !",
            newUser
        })
    } catch (error) {
        console.log(error)
        res.send({
            success:0,
            message:error
        }) 
    }
}

module.exports.login = async(req,res)=>{
    try {
        const {email , password} = req.body;
        const usr = await User.findOne({email:email});
        if(!usr){
            return res.send({
                success:0,
                message:"Wrong Email Address"
            })
        }
        const compare = await bcrypt.compare(password , usr.password);
        if(!compare){
            return res.send({
                success:0,
                message:"Wrong Password"
            })
        }
        const token = jwtToken.generateToken(usr);
        const updatedUsr = await User.findByIdAndUpdate(usr._id,{
            token:token
        });
        res.send({
            success:1,
            message:"User login Successfull",
            updatedUsr
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        }) 
    }
}

module.exports.forgetPass = async(req,res)=>{
    try {
        const {email} = req.body;
        const otp = randomInt(1000,10000);
        const usr = await User.findOneAndUpdate({email},{
            $set:{
                otp:otp
            }
        })
        if(!usr){
            return res.send({
                success:0,
                message:"Wrong email."
            })
        }
        res.send({
            success:1,
            message:"OTP sent successfully ",
            usr
        })
    } catch (error) {
        console.log(error)
        res.send({
            success:0,
            message:error
        }) 
    }
}

module.exports.changePass = async(req,res)=>{
    try {
        const {otp , pass} = req.body;
        const {id} = req.query;
        const usr = await User.findById(id);
        if(!usr){
            return res.send({
                success:0,
                message:"Something went wrong !"
            })
        }
        if(otp === usr.otp){
        const empass = await bcrypt.hash(pass,10);
        await User.findByIdAndUpdate(id,{
            password:empass
        });
        }
        res.send({
            success:1,
            message:"Password has updated successfully "
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}