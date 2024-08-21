
//only registered users not admin 


var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const UserService = require('../services/UserService');
const CartService = require('../services/CartService');
const { authenticate, authorize } = require('../middlewares/auth');
const OrderController = require('../controllers/OrderController');
const CategoryService = require('../services/CategoryService');
const BrandService = require('../services/BrandService');

//middleware for registered users only not Admin 

const authorizeUser=(req,res,next)=> {
    
    //check if it is user or not 
    if (req.user.role !=='user') {
        return res.status(403).json({
            status:"error",
            message:"Access Denied. Only registered users are allowed to access this page"
        })
    }

    next();
};

//get user panel home page

router.get('/', authenticate, authorizeUser,  async (req, res) =>  {

    //#swagger.tags=["User"]
        //#swagger.description="This route render page for registered users. This route produces render userPanel.ejs"
        
    try {

        console.log("active user",req.user);

        // Fetch categories and brands for the search bar
       const categories = await CategoryService.getAll();
       const brands = await BrandService.getAll();
        res.render('userPanel', { 
            title: "User Page", 
            user: req.user ,
            categories,
            brands
        
        });
    } catch(error) {
        console.error('Error rendering user panel:', error);
        res.status(500).json({ message: 'Server error' });
    }
})



module.exports=router;