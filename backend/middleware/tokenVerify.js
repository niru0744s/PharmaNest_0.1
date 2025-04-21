const jwt = require('jsonwebtoken');

module.exports.generateToken = (user)=> {
    const payload = {email: user.email };
    const options = {
      expiresIn: '1h', 
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports.authenticateToken = (req, res, next)=> {
    // Expect header: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token      = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = decoded;  // attach the decoded payload to req.user
      next();
    });
  }