const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticate, authorize } = require('../middlewares/auth');

// Order routes
router.post('/', authenticate, OrderController.createOrder);
router.get('/', authenticate, authorize(['admin']), OrderController.getAllOrders);
router.get('/myorders', authenticate, OrderController.getUserOrders);
router.patch('/status', authenticate, authorize(['admin']), OrderController.updateOrderStatus);
router.get('/:orderId', authenticate, OrderController.getOrderById);

module.exports = router;
