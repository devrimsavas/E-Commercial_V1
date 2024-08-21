const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticate, authorize } = require('../middlewares/auth');

// Common Routes for all users
router.get('/', ProductController.getAllProducts);
router.post('/search', ProductController.searchProducts);

//get only one product
router.get('/:id', ProductController.getProductById);

// Routes for admin only
router.post('/', authenticate, authorize(['admin']), ProductController.createProduct);

//update product
router.put('/:id', authenticate, authorize(['admin']), ProductController.updateProduct);
//delete product
router.delete('/:id', authenticate, authorize(['admin']), ProductController.deleteProduct);

//undelete product  soft undelete or delete
router.put('/:id/undelete', authenticate, authorize(['admin']), ProductController.undeleteProduct); 

module.exports = router;
