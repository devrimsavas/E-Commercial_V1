const express=require('express');
const router=express.Router();
const CartController=require('../controllers/CartController');
const {authenticate}=require('../middlewares/auth');


//cart routes 

router.post('/', authenticate, CartController.addItemToCart);
router.get('/', authenticate, CartController.getCart);
router.put('/', authenticate, CartController.updateCartItem);
router.delete('/', authenticate, CartController.removeItemFromCart);
router.post('/checkout', authenticate, CartController.checkoutCart);


module.exports=router