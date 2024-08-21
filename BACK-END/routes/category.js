//category routes 

const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { authenticate, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);  // Get category by ID route

// Admin routes
router.post('/', authenticate, authorize(['admin']), CategoryController.createCategory);
router.put('/:id', authenticate, authorize(['admin']), CategoryController.updateCategory);
router.delete('/:id', authenticate, authorize(['admin']), CategoryController.deleteCategory);

module.exports = router;
