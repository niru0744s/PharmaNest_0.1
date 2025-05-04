const jwt = require('jsonwebtoken');

module.exports.generateToken = (user)=> {
    const payload = {email: user.email };
    const options = {
      expiresIn: '1h', 
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports.authenticateToken = (req, res, next)=> {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).send({
        success:0,
        message:"No token provided , authorization denied"
      });
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });
  
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = decoded;  // attach the decoded payload to req.user
        next();
      });
    } catch (error) {
      res.status(401).send({
        success:0,
        message:"Token is not valid "
      })
    }
  }