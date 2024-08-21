var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const UserService = require('../services/UserService');
const CartService = require('../services/CartService');

// GET login page
router.get('/login', function(req, res) {

    //#swagger.tags=["Auth"]
    //#swagger.description="This is the Login Page for Admin or User"
    //#swagger.produces=['application/json']
    



    res.render('login', { title: "Login Page", user:null });
});

// POST login page
router.post('/login', async function(req, res) {


    //#swagger.tags=["Auth"]
    //#swagger.description="Login for Admin or User based on role"
    //#swagger.produces=['application/json']
    /*#swagger.parameters['body']= {
        in: 'body',
        description: 'Login for Admin or User based on role',
        required: true,
        schema: {
            $ref: "#/definitions/Login"
        }
    }
    */


        
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Identifier and password are required' });
    }

    try {
        const user = await UserService.findByUsernameOrEmail(identifier);

        if (!user || !(await UserService.validatePassword(user, password))) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: '2h' });
        res.cookie('token', token, { httpOnly: true, secure: false });

        //check end point again for admin= /admin for registered users=/registeredUsers
        const message = user.role === 'admin' ? 'Admin logged in successfully' : 'User logged in successfully';
        const redirectUrl = user.role === 'admin' ? '/admin' : '/registeredUsers';

        res.json({
            status: "success",
            statuscode: 200,
            data: {
                message,
                token,
                userId: user.id,
                username: user.username,
                userEmail: user.email,
                role: user.role,
                redirectUrl
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sign up page
router.get('/signup', function(req, res) {

    //#swagger.tags=["Auth"]
    //#swagger.description="This is the Signup Page for  User"
    
    res.render('signup', { title: "Sign Up Page", user:null });
});

// POST signup page
router.post('/signup', async function(req, res) {

    //#swagger.tags=["Auth"]
    //#swagger.description="Signup for new User"
    /*#swagger.parameters['body']= {
        
        in: 'body',
        description: 'Signup for Admin or User based on role',
        required: true,
        schema: {
            $ref: "#/definitions/UserSignup"
        }
    }
    */
    const { firstname, lastname, username, email, password, address, telephonenumber } = req.body;

    if (!firstname || !lastname || !username || !email || !password || !address || !telephonenumber) {
        return res.status(400).json({ status: 'fail', message: 'All fields are required' });
    }

    try {
        if (await UserService.findByUsername(username) || await UserService.findByEmail(email)) {
            return res.status(400).json({ status: 'fail', message: 'Username or email already exists' });
        }

        const newUser = await UserService.create({
            firstname,
            lastname,
            username,
            email,
            password,
            address,
            telephonenumber,
            MembershipStatusId: 1,
            role: 'user'
        });

        await CartService.createCart(newUser.id);

        res.status(201).json({
            status: 'success',
            statuscode: 201,
            data: { message: 'User registered successfully', newUser }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ status: 'fail', message: 'Server error' });
    }
});

// Logout
router.get('/logout', function(req, res) {
    //#swagger.tags=["Auth"]
    //#swagger.description="Logout for Admin or User based on role"
    


    res.clearCookie('token');
    //res.json({ status: "success", message: 'Logged out successfully' });
    res.redirect('/auth/login');
});

module.exports = router;
