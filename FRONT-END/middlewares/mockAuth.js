const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const mockUser = {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@noroff.no'
};

const generateMockToken = () => {   //generateMockToken 
    return jwt.sign(mockUser, process.env.TOKEN_SECRET, { expiresIn: '2h' });
};

const authenticate = (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : req.cookies.token;
    console.log("token received in Middleware", token);
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. You need to login first to access this resource' });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'This user is not authorized to access this resource' });
        }
        next();
    };
};

module.exports = { router, authenticate, authorize, generateMockToken };
