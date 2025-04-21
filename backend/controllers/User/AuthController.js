const User = require('../../modules/User');
const {randomInt} = require('crypto');
const bcrypt = require('bcrypt');
const jwtToken = require('../../middleware/tokenVerify');

module.exports.otpSent = async (req,res)=>{
    try {
        const {firstName,lastName,email} = req.body;
        const exstUser = await User.findOne({email:email});
        if(exstUser){
            res.send({
                success:0,
                message:"User is already registered , Try to login !"
            })
        }
        const otp = randomInt(1000,10000);
        const newUSr = new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            otp:otp
        });
        newUSr.save();
        res.send({
            success:1,
            message:"OTP sent successfully !",
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
    if(otp !== exUser.otp){
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
        const {pass} = req.body;
        const {id} = req.query;
        const empass = bcrypt.hash(pass,10);
        await User.findByIdAndUpdate(id,{
            password:pass
        });
    } catch (error) {
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
            res.send({
                success:0,
                message:"Wrong Email Address"
            })
        }
        const compare = bcrypt.compare(usr.password,password);
        if(!compare){
            res.send({
                success:0,
                message:"Wrong Password"
            })
        }
        const token = jwtToken.generateToken(usr);
        User.findByIdAndUpdate(usr._id,{
            token:token
        });
        res.send({
            success:1,
            message:"User login Successfull"
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
        if(!email){
            res.send({
                success:0,
                message:"Wrong email."
            })
        }
        const otp = randomInt(1000,10000);
        const usr = await findOneAndUpdate({email},{
            $set:{
                otp:otp
            }
        })
        res.send({
            success:1,
            message:"OTP sent successfully ",
            usr
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        }) 
    }
}

module.exports.changePass = async(req,res)=>{
    try {
        const {pass} = req.body;
        const {id} = req.query;
        const empass = bcrypt.hash(pass,10);
        await User.findByIdAndUpdate(id,{
            password:empass
        });
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