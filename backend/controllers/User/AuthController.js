const User = require('../../modules/User');
const {randomInt} = require('crypto');

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