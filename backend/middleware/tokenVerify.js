const jwt = require('jsonwebtoken');
const Host = require("../modules/Host");

module.exports.generateToken = (user)=> {
    const payload = {
      firstName:user.firstName,
      email:user.email,
      _id:user._id
    };
    const options = {
      expiresIn: '10h', 
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports.userMiddleware = (req, res, next)=> {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).send({
        success:0,
        message:"No token provided , authorization denied"
      });
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ 
      success:0,
      message: 'Missing token' 
    });
  
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET) 
      if(!decode) res.send({success:0,message:"Token is Unvalid !"});
        req.user = decode;
        next();
    } catch (error) {
      res.status(401).send({
        success:0,
        message:"Token is not valid "
      })
    }
  }

module.exports.hostMiddleware = async(req,res,next)=>{
  const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).send({
        success:0,
        message:"No token provided , authorization denied"
      });
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ 
      success:0,
      message: 'Missing token' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.user.operator == "host"){
          req.user = decoded.user; 
          next();
        } else {
          res.send({
            success:0,
            message:"You are not the Seller"
          })
        }
    } catch (error) {
      res.status(401).send({
        success:0,
        message:error
      })
    }
}