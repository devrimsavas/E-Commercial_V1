var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//const { authenticate, authorize } = require('../middlewares/auth');

const { authenticate, authorize } = require('../middlewares/mockAuth');

const axios = require('axios');

router.get('/', authenticate, authorize(['admin']), async (req, res) => {

     //#swagger.tags=["Admin"]
    //#swagger.description="Admin Page needs token. This route produces render adminPanel.ejs"
    //#swagger.produces=['text/html']
    /* swagger.parameters['body']= {
        in: 'body',
        description: 'Admin Page needs token',
        required: true,
        
    }
    */

    
    try {
        const token = req.cookies.token;

        // Fetch categories and brands for the search bar
        const [categoriesResponse, brandsResponse] = await Promise.all([
            axios.get('http://localhost:3000/category', {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:3000/brand', {
                headers: { Authorization: `Bearer ${token}` }
            })
        ]);

        const categories = categoriesResponse.data.data.categories;
        const brands = brandsResponse.data.data.brands;

        res.render('adminPanel', { 
            title: "Admin Page",
            user: req.user,
            categories,
            brands
        });
    } catch (error) {
        console.error('Error fetching categories and brands:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Brands
router.get('/brands', authenticate, authorize(['admin']), async (req, res) => {

     //#swagger.tags=["Admin"]
    //#swagger.description="Admin Get Brands Page"
    //#swagger.produces=['application/json']
    /* swagger.parameters['body']= {
        in: 'body',
        description: 'Admin Get Brands Page needs token',
        required: true,
        
    }
    */
    try {
        const token = req.cookies.token;

        const response = await axios.get('http://localhost:3000/brand', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const brands = response.data.data.brands;
        res.render('brands', { brands: brands, user: req.user });
    } catch (error) {
        console.error('Error fetching brands:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Categories
router.get('/categories', authenticate, authorize(['admin']), async (req, res) => {

     //#swagger.tags=["Admin"]
    //#swagger.description="Admin Get Categories Page"
    //#swagger.produces=['application/json']
    /* swagger.parameters['body']= {
        in: 'body',
        description: 'Admin Get Categories Page needs token',
        required: true,
        
    }
    */

    
    try {
        const token = req.cookies.token;

        const response = await axios.get('http://localhost:3000/category', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const categories = response.data.data.categories;
        res.render('categories', { categories: categories, user: req.user });
    } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Users
router.get('/allusers', authenticate, authorize(['admin']), async (req, res) => {

    //#swagger.tags=["Admin"]
    //#swagger.description="Admin Page needs token. This route gets all users by Admin. This route produces render adminPanel.ejs user routes for json response"
    //#swagger.produces=['text/html']
    /* swagger.parameters['body']= {
        in: 'body',
        description: 'Admin Page needs token',
        required: true,
        
    }
    */
    try {
        const token = req.cookies.token;

        const response = await axios.get('http://localhost:3000/user/all', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const users = response.data.data;
        res.render('allusers', { users: users, user: req.user });
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Orders
router.get('/orders', authenticate, authorize(['admin']), async (req, res) => {
    //#swagger.tags=["Admin"]
    //#swagger.description="Admin Page needs token. This route gets all users by Admin. This route produces render adminPanel.ejs user routes for json response"
    //#swagger.produces=['text/html']
    
    try {
        const token = req.cookies.token;

        const response = await axios.get('http://localhost:3000/order', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const orders = response.data.data;
        res.render('orders', { orders: orders, user: req.user });
    } catch (error) {
        console.error('Error fetching orders:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


//admin login page for frontend 

// GET login page
router.get('/login', function(req, res) {

    //#swagger.tags=["Admin"]
    //#swagger.description="This is the Login Page for only admin"
    //#swagger.produces=['application/json']
    



    res.render('adminlogin', { title: "Login Page", user:null });
});






//it is admin login post 

router.post('/login', async (req, res) => {

    //#swagger.tags=["Admin"]
    //#swagger.description="Login for Admin for front page"
    //#swagger.produces=['application/json']
    /*#swagger.parameters['body']= {
        in: 'body',
        description: 'Login for Admin for front page',
        required: true,
        schema: {
            $ref: "#/definitions/frontadminlogin"
        }
    }
    */    

    const { identifier, password } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/auth/login', {
            identifier,
            password
        });

        //check json format here 
        const {token, userId,username,userEmail,role,redirectUrl} = response.data.data //.token;


        console.log("it is response ",response.data.data)
        res.cookie('token', token, { httpOnly: true, secure: false });

        

        res.json({
            status: "success",
            statuscode: 200,
            data: {
                message: 'Admin logged in successfully',
                token,
                userId,
                username,
                userEmail,
                role,
                redirectUrl
                
            }
        });
    } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
