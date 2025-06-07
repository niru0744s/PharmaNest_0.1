const validateSchemas = require("../schema");

module.exports.validateEmail = (req,res,next) =>{
    let {error} = validateSchemas.emailSent.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        res.status(400).send({errMsg});
    }else{
        next();
    }
};

module.exports.otp = (req,res,next) =>{
    let {error} = validateSchemas.otpVerify.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        res.status(400).send({errMsg});
    }else{
        next();
    }
};

module.exports.userCredentials = (req,res,next)=>{
    let {error} = validateSchemas.userCredentials.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        res.status(400).send({errMsg});
    }else{
        next();
    }
};

module.exports.hostCredentials = (req,res,next)=>{
    let {error} = validateSchemas.hostCredentials.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        res.status(400).send({errMsg});
    }else{
        next();
    }
}

module.exports.login = (req,res,next)=>{
    let {error} = validateSchemas.loginSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        res.status(400).send({errMsg});
    }else{
        next();
    }
};

module.exports.product = (req,res,next)=>{
    let {error} = validateSchemas.products.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        res.status(400).send({errMsg});
    }else{
        next();
    }
};

module.exports.address = (req,res,next)=>{
    let {error} = validateSchemas.location.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        res.status(400).send({errMsg});
    }else{
        next();
    }
};