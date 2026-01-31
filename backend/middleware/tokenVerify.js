const jwt = require('jsonwebtoken');
const Host = require("../modules/Host");
const User = require("../modules/User");
const RefreshToken = require("../modules/RefreshToken");
const crypto = require('crypto');

// Generate Access Token (short-lived: 15 minutes)
module.exports.generateAccessToken = (user, role) => {
  const payload = {
    firstName: user.firstName,
    email: user.email,
    _id: user._id,
    role: role // 'user' or 'seller'
  };
  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// Generate Refresh Token (long-lived: 7 days)
module.exports.generateRefreshToken = async (user, userModel) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  const refreshToken = new RefreshToken({
    token,
    user: user._id,
    userModel, // 'User' or 'Host'
    expiresAt
  });

  await refreshToken.save();
  return token;
}

// Generate both tokens
module.exports.generateTokens = async (user, userModel) => {
  const role = userModel === 'User' ? 'user' : 'host';
  const accessToken = module.exports.generateAccessToken(user, role);
  const refreshToken = await module.exports.generateRefreshToken(user, userModel);

  return { accessToken, refreshToken };
}

// Verify and refresh access token
module.exports.refreshAccessToken = async (refreshTokenString) => {
  const refreshToken = await RefreshToken.findOne({
    token: refreshTokenString,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  });

  if (!refreshToken) {
    throw new Error('Invalid or expired refresh token');
  }

  // Get user data
  const Model = refreshToken.userModel === 'User' ? User : Host;
  const user = await Model.findById(refreshToken.user);

  if (!user) {
    throw new Error('User not found');
  }

  // Generate new tokens
  const role = refreshToken.userModel === 'User' ? 'user' : 'host';
  const newAccessToken = module.exports.generateAccessToken(user, role);

  // Optional: Token rotation - generate new refresh token
  const newRefreshToken = await module.exports.generateRefreshToken(user, refreshToken.userModel);

  // Revoke old refresh token
  refreshToken.isRevoked = true;
  await refreshToken.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// Revoke refresh token (logout)
module.exports.revokeRefreshToken = async (refreshTokenString) => {
  const refreshToken = await RefreshToken.findOne({ token: refreshTokenString });

  if (refreshToken) {
    refreshToken.isRevoked = true;
    await refreshToken.save();
  }
}

// User Middleware (with role check)
module.exports.userMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({
      success: 0,
      message: "No token provided, authorization denied"
    });
  }
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({
    success: 0,
    message: 'Missing token'
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.send({ success: 0, message: "Token is invalid!" });
    }

    // Check if user role
    if (decoded.role !== 'user' && decoded.role !== 'doctor' && decoded.role !== 'admin') {
      return res.status(403).send({
        success: 0,
        message: "Access denied. Valid user role required."
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({
      success: 0,
      message: error.name === 'TokenExpiredError'
        ? "Token has expired. Please refresh your token."
        : "Token is not valid"
    });
  }
}

// Host Middleware (with role check)
module.exports.hostMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({
      success: 0,
      message: "No token provided, authorization denied"
    });
  }
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: 0,
      message: 'Missing token'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if host role
    if (decoded.role !== 'host') {
      return res.status(403).send({
        success: 0,
        message: "Access denied. Host role required."
      });
    }

    const hostData = await Host.findById(decoded._id);
    if (!hostData) {
      return res.status(404).send({
        success: 0,
        message: "Seller not found"
      });
    }

    req.user = hostData;
    next();
  } catch (error) {
    res.status(401).send({
      success: 0,
      message: error.name === 'TokenExpiredError'
        ? "Token has expired. Please refresh your token."
        : "Token is not valid"
    });
  }
}

// Legacy function for backward compatibility (deprecated)
module.exports.generateToken = (user) => {
  console.warn('generateToken is deprecated. Use generateAccessToken instead.');
  return module.exports.generateAccessToken(user, 'user');
}