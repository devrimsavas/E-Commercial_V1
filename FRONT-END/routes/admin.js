var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//const { authenticate, authorize } = require('../middlewares/auth');

const { authenticate, authorize } = require('../middlewares/mockAuth');

const axios = require('axios');

router.get('/products', authenticate, authorize(['admin']), async (req, res) => {

    try {
        const token = req.cookies.token;
        const response = await axios.get('http://localhost:3000/products', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const products = response.data.data.products;
        //res.render('products', { products: products, user: req.user });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});



router.get('/', authenticate, authorize(['admin']), async (req, res) => {


    
    try {
        const token = req.cookies.token;
        console.log("admin page get token ",token)

        // Fetch categories and brands for the search bar
        const [categoriesResponse, brandsResponse, productsResponse] = await Promise.all([
            axios.get('http://localhost:3000/category', {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:3000/brand', {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:3000/products', {
                //headers: { Authorization: `Bearer ${token}` }
            })
        ]);

        const categories = categoriesResponse.data.data.categories;
        const brands = brandsResponse.data.data.brands;
        const products = productsResponse.data.data.products;
        console.log("products ",productsResponse.data.data.products)

        res.render('adminPanel', { 
            title: "Admin Page",
            user: req.user,
            categories,
            brands,
            products
        });
    } catch (error) {
        console.error('Error fetching categories and brands:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Brands
router.get('/brands', authenticate, authorize(['admin']), async (req, res) => {

    
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


    res.render('adminlogin', { title: "Login Page", user:null });
});






//it is admin login post 

router.post('/login', async (req, res) => {



    const { identifier, password } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/auth/login', {
            identifier,
            password
        });

        //check json format here 
        const {token, userId,username,userEmail,role,redirectUrl} = response.data.data //.token;


        console.log("it is response and token ",response.data.data)

        

        
        res.cookie('token', token, {  secure: false }); //httpOnly: true,
        

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

router.get('/logout',(req,res)=> {

    res.clearCookie('token');
    res.redirect('/admin/login');
});


module.exports = router;
