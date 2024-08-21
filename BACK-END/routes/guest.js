//for guest users limited access 

// routes/guest.js
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const axios = require('axios');

const CategoryService = require('../services/CategoryService');
const BrandService = require('../services/BrandService');


// Define a guest user object
const guestUser = {
    id: null,
    username: 'Guest',
    role: 'guest'
};

// Middleware to locally check if the user is authenticated
const checkGuest = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = guestUser;
        //added later 
        req.categories=await CategoryService.getAll();
        req.brands=await BrandService.getAll();
        return next();
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        req.categories=await CategoryService.getAll();
        req.brands=await BrandService.getAll();
        next();
    } catch (error) {
        console.error('Invalid Token:', error);
        req.user = guestUser;
        req.categories=await CategoryService.getAll();
        req.brands=await BrandService.getAll();
        next();
    }
};

router.get('/', checkGuest,  async (req, res) => {
    // req.user will be set to the authenticated user or guest
    const user = req.user;

       // Fetch categories and brands for the search bar
       const categories = await CategoryService.getAll();
       const brands = await BrandService.getAll();
       
    res.render('guestView', { title: "Guest View", user, categories, brands });
});

//guest category route 

router.get('/guestcategory', checkGuest, async (req, res) => {

    //#swagger.tags=["Guest"]
    //#swagger.description="This route render page for guest users. This route produces render guestCategory.ejs"   
    



    try {
        const user = req.user;
        // Using axios.get 
        const response = await axios.get('http://localhost:3000/category');
        const categories = response.data.data.categories  ; // check this again write a test line
        console.log(categories);

        // json for test 

        /*
        res.json({
            title: "Guest Category",
            user,
            categories: categories
        });
        */
        

        
        res.render('categories', { title: "Guest Category", user, categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Handling errors, send a server error status code
        res.status(500).send('Server error occurred');
    }
});


//guest brand route 

router.get('/guestbrand', checkGuest, async (req, res) => {
    //#swagger.tags=["Guest"]
    //#swagger.description="This route render page for guest users. This route produces render guestBrand.ejs"

    try {
        const user= req.user;
        // Using axios.get 
        const response = await axios.get('http://localhost:3000/brand');
        const brands = response.data.data.brands  ; // Accessing data property of the response
        console.log(brands);
        res.render('brands', { title: "Guest Brand", user, brands });
    }

    catch (error) {
        console.error('Error fetching brands:', error);
        // Handling errors, send a server error status code
        res.status(500).send('Server error occurred');
    }
});

module.exports = router;
