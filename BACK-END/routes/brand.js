
//brand routes

const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/BrandController');
const { authenticate, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', BrandController.getAllBrands );

// Admin routes
router.post('/', authenticate, authorize(['admin']), BrandController.createBrand);
router.put('/:id', authenticate, authorize(['admin']), BrandController.updateBrand);
router.delete('/:id', authenticate, authorize(['admin']), BrandController.deleteBrand);

module.exports = router;
