const ErrorResponse = require('../utils/ErrorResponse');

// Middleware to check if user has required role(s)
module.exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({
                success: 0,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send({
                success: 0,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

// Middleware to check if email is verified
module.exports.requireVerified = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            success: 0,
            message: 'Authentication required'
        });
    }

    // Check if user has isVerified field and if it's true
    if (req.user.isVerified === false) {
        return res.status(403).send({
            success: 0,
            message: 'Email verification required. Please verify your email address.'
        });
    }

    next();
};

// Middleware to check if seller is approved (for hosts)
module.exports.requireApproved = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            success: 0,
            message: 'Authentication required'
        });
    }

    // Check if seller account is approved
    if (req.user.isApproved === false) {
        return res.status(403).send({
            success: 0,
            message: 'Seller account pending approval. Please wait for admin approval.'
        });
    }

    next();
};
