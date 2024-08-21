const { Order, OrderItem, User, Product } = require('../models');
const { v4: uuidv4 } = require('uuid');
const CartService = require('./CartService'); // Import CartService for recalculateMembershipStatus

class OrderService {
    static async createOrder(userId) {
        const orderNumber = uuidv4().slice(0, 8);
        const user = await User.findByPk(userId);
        const cart = await user.getCarts({ where: { status: 'active' }, include: [{ model: OrderItem, include: Product }] });
        
        if (!cart.length) {
            throw new Error('No active cart found');
        }

        const activeCart = cart[0];
        const order = await Order.create({
            orderNumber,
            UserId: userId,
            status: 'in process',
            membershipStatus: user.MembershipStatusId
        });

        let totalPrice = 0;

        for (const item of activeCart.CartItems) {
            await OrderItem.create({
                OrderId: order.id,
                ProductId: item.ProductId,
                quantity: item.quantity,
                unit_price: item.unit_price
            });

            const product = await Product.findByPk(item.ProductId);
            product.quantity -= item.quantity;
            await product.save();

            totalPrice += item.unit_price * item.quantity;
        }

        activeCart.status = 'completed';
        await activeCart.save();

        // Recalculate membership status and get the new discount percentage
        const discountPercentage = await CartService.recalculateMembershipStatus(userId);

        const discountAmount = totalPrice * (discountPercentage / 100);
        const finalPrice = totalPrice - discountAmount;

        return {
            order,
            totalPrice,
            discountPercentage,
            discountAmount,
            finalPrice
        };
    }

    static async getAllOrders(userId, isAdmin) {
        const orders = isAdmin 
            ? await Order.findAll({ include: [OrderItem, User] })
            : await Order.findAll({ where: { UserId: userId }, include: [OrderItem] });

        for (let order of orders) {
            let totalPrice = 0;
            for (const item of order.OrderItems) {
                totalPrice += item.unit_price * item.quantity;
            }

            const discountPercentage = await CartService.recalculateMembershipStatus(order.UserId);
            const discountAmount = totalPrice * (discountPercentage / 100);
            const finalPrice = totalPrice - discountAmount;

            order.dataValues.totalPrice = totalPrice;
            order.dataValues.discountPercentage = discountPercentage;
            order.dataValues.discountAmount = discountAmount;
            order.dataValues.finalPrice = finalPrice;
        }

        return orders;
    }

    static async getUserOrders(userId) {
        return await Order.findAll({ where: { UserId: userId }, include: [OrderItem] });
    }

    static async updateOrderStatus(orderId, status) {
        const [updated] = await Order.update({ status }, { where: { id: orderId } });
        return updated;
    }

    static async getOrderById(orderId) {
        const order = await Order.findByPk(orderId, { include: [OrderItem, User] });

        let totalPrice = 0;
        for (const item of order.OrderItems) {
            totalPrice += item.unit_price * item.quantity;
        }

        const discountPercentage = await CartService.recalculateMembershipStatus(order.UserId);
        const discountAmount = totalPrice * (discountPercentage / 100);
        const finalPrice = totalPrice - discountAmount;

        order.dataValues.totalPrice = totalPrice;
        order.dataValues.discountPercentage = discountPercentage;
        order.dataValues.discountAmount = discountAmount;
        order.dataValues.finalPrice = finalPrice;

        return order;
    }
}

module.exports = OrderService;
