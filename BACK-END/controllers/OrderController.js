const OrderService = require('../services/OrderService');

class OrderController {
    static async createOrder(req, res) {

        //#swagger.tags=["Order"]
        //#swagger.description="Create order by user"
        try {
            const userId = req.user.id;
            const order = await OrderService.createOrder(userId);
            res.status(201).json({ status: 'success', data: order });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }

    static async getAllOrders(req, res) {

        //#swagger.tags=["Order"]
        //#swagger.description="Admin can get all orders needs admin token for authorization"
        try {
            const userId = req.user.id;
            const isAdmin = req.user.role === 'admin';
            const orders = await OrderService.getAllOrders(userId, isAdmin);
            res.status(200).json({ status: 'success', data: orders });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }

    static async getUserOrders(req, res) {

        //#swagger.tags=["Order"]
        //#swagger.description="A registered user can see his/her all orders"
        
        try {
            const userId = req.user.id;
            const orders = await OrderService.getUserOrders(userId);
            res.status(200).json({ status: 'success', data: orders });
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }

    static async getOrderById(req, res) {

        //#swagger.tags=["Order"]
        //#swagger.description="Admin can get order by id needs Admin Token for authorization"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Admin can get order by id needs Admin Token for authorization',
            required: true,
            schema: {
                $ref: "#/definitions/getOrderId"
            }
            
        }
        */
       
        try {
            const { orderId } = req.params;
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({ status: 'error', message: 'Order not found' });
            }
            res.status(200).json({ status: 'success', data: order });
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }

    
    static async updateOrderStatus(req, res) {

        //#swagger.tags=["Order"]
        //#swagger.description="Admin can update order status needs Admin Token for authorization"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Admin can update order status needs Admin Token for authorization',
            required: true,
            schema: {
                $ref: "#/definitions/updateOrderStatus"
            }
            
        }
        */
        try {
            const { orderId, status } = req.body;

            // Check if the order exists before updating
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({ status: 'error', message: 'Order not found' });
            }

            const updated = await OrderService.updateOrderStatus(orderId, status);
            if (!updated) {
                return res.status(404).json({ status: 'error', message: 'Order not found or could not be updated' });
            }

            res.status(200).json({ status: 'success', message: 'Order status updated successfully' });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }



    


}

module.exports = OrderController;
