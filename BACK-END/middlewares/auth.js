const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');

// Middleware to authenticate the token and check if it is valid
const authenticate = (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : req.cookies.token;
    if (!token) {
        //  401 Unauthorized response
        return res.status(401).json({
            statusCode: 401,
            message: 'Access Denied you need to Login First to access this resource'
        });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        // Sending a 400 Bad Request if the token is invalid
        return res.status(400).json({
            message: 'Invalid Token'
        });
    }
};

// Middleware to authorize user roles
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // Sending a 403 Forbidden if the user role is not authorized maybe i can write a page for it. for general rejection. 
            return res.status(403).json({
                message: 'This user is not authorized to access this resource'
            });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
