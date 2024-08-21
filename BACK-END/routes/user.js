const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middlewares/auth');

// Routes for all users
router.get('/me', authenticate, UserController.getUserDetails);

// Routes for admin only
router.get('/all', authenticate, authorize(['admin']), UserController.getAllUsers);
router.put('/:id', authenticate, authorize(['admin']), UserController.updateUser);
router.patch('/:id/role', authenticate, authorize(['admin']), UserController.updateUserRole);
router.delete('/:id', authenticate, authorize(['admin']), UserController.deleteUser);

module.exports = router;
