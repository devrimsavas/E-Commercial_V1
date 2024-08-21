// routes/guest.js
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// Define a guest user object
const guestUser = {
    id: null,
    username: 'Guest',
    role: 'guest'
};

// Middleware to locally check if the user is authenticated
const checkGuest = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = guestUser;
        return next();
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error('Invalid Token:', error);
        req.user = guestUser;
        next();
    }
};

router.get('/', checkGuest, (req, res) => {

    //#swagger.tags=["Guest"]
    
    // req.user will be set to the authenticated user or guest
    const user = req.user;

    res.render('index', { title: "Home Page", user });
});

module.exports = router;