const { Cart, CartItem, Product, Order, OrderItem, MembershipStatus, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const ProductService = require('./ProductService'); // Import ProductService

class CartService {
    static async addItemToCart(userId, productId, quantity) {
        const cart = await Cart.findOne({ where: { UserId: userId, status: 'active' } });
        const product = await Product.findByPk(productId);

        // Check if the product is available and not soft deleted
        if (!product || product.status === 'out-of-stock' || product.isdeleted) {
            throw new Error('Product not available');
        }

        // Calculate the total quantity of the product considering only non-deleted cart items
        const totalCartQuantity = await CartItem.sum('quantity', {
            where: { ProductId: productId, soft_deleted: false }
        });

        if (totalCartQuantity + quantity > product.quantity) {
            throw new Error('Not enough stock available');
        }

        const currentCartItem = await CartItem.findOne({
            where: { CartId: cart.id, ProductId: productId, soft_deleted: false } // Consider only non-deleted items
        });
        const newQuantity = currentCartItem ? currentCartItem.quantity + quantity : quantity;

        if (currentCartItem) {
            currentCartItem.quantity = newQuantity;
            await currentCartItem.save();
        } else {
            await CartItem.create({ CartId: cart.id, ProductId: productId, quantity, unit_price: product.price });
        }

        // Update product status after adding to cart
        await ProductService.updateProductStatus(productId);

        return await CartItem.findOne({ where: { CartId: cart.id, ProductId: productId, soft_deleted: false }, include: Product });
    }

    static async getCart(userId) {
        const cart = await Cart.findOne({
            where: { UserId: userId, status: 'active' },
            include: {
                model: CartItem,
                where: { soft_deleted: false }, // Include only non-deleted items
                include: Product
            }
        });
        return cart;
    }

    static async updateCartItem(userId, productId, quantity) {
        const cart = await Cart.findOne({ where: { UserId: userId, status: 'active' } });
        const cartItem = await CartItem.findOne({ where: { CartId: cart.id, ProductId: productId, soft_deleted: false } });
        const product = await Product.findByPk(productId);

        // Check if the product is available and not soft deleted
        if (!product || product.status === 'out-of-stock' || product.isdeleted) {
            throw new Error('Product not available');
        }

        // Calculate the total quantity of the product considering only non-deleted cart items
        const totalCartQuantity = await CartItem.sum('quantity', {
            where: { ProductId: productId, soft_deleted: false }
        });

        if (totalCartQuantity + quantity - (cartItem ? cartItem.quantity : 0) > product.quantity) {
            throw new Error('Not enough stock available');
        }

        if (cartItem) {
            cartItem.quantity = quantity;
            await cartItem.save();
        } else {
            throw new Error('Cart item not found');
        }

        // Update product status after updating cart
        await ProductService.updateProductStatus(productId);

        return cartItem;
    }

    static async removeItemFromCart(userId, productId) {
        const cart = await Cart.findOne({ where: { UserId: userId, status: 'active' } });
        const cartItem = await CartItem.findOne({ where: { CartId: cart.id, ProductId: productId, soft_deleted: false } });

        if (cartItem) {
            cartItem.soft_deleted = true;
            await cartItem.save();
        } else {
            throw new Error('Cart item not found');
        }

        // Update product status after removing from cart
        await ProductService.updateProductStatus(productId);
    }

    static async checkoutCart(userId) {
        const cart = await Cart.findOne({
            where: { UserId: userId, status: 'active' },
            include: [{ model: CartItem, where: { soft_deleted: false }, include: Product }] // Only include non-deleted items
        });

        if (!cart) {
            throw new Error('No active cart found');
        }

        const orderNumber = uuidv4().slice(0, 8); // Generate a unique 8-character order number
        const user = await User.findByPk(userId);
        const order = await Order.create({ UserId: userId, status: 'in process', orderNumber, membershipStatus: user.MembershipStatusId });

        let totalPrice = 0;

        for (const item of cart.CartItems) {
            const product = item.Product;

            if (!product) {
                throw new Error(`Product not found for item with ID: ${item.id}`);
            }

            if (item.quantity > product.quantity) {
                throw new Error(`Not enough stock for ${product.name}`);
            }

            totalPrice += item.unit_price * item.quantity;

            await OrderItem.create({
                OrderId: order.id,
                ProductId: item.ProductId,
                quantity: item.quantity,
                unit_price: item.unit_price
            });

            product.quantity -= item.quantity;
            await product.save();
        }

        cart.status = 'completed';
        await cart.save();

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

    static async recalculateMembershipStatus(userId) {
        const user = await User.findByPk(userId, {
            include: [{
                model: Order,
                include: [OrderItem] // Include OrderItems when fetching Orders
            }]
        });

        if (!user) {
            throw new Error('User not found');
        }

        const totalItemsPurchased = user.Orders.reduce((total, order) => total + order.OrderItems.reduce((orderTotal, item) => orderTotal + item.quantity, 0), 0);
        let newStatusId;

        // Log the total items purchased for debugging
        console.log(`Total items purchased: ${totalItemsPurchased} by user ${userId}`);

        if (totalItemsPurchased >= 30) {
            newStatusId = 3; // Gold
        } else if (totalItemsPurchased >= 15) {
            newStatusId = 2; // Silver
        } else {
            newStatusId = 1; // Bronze
        }

        user.MembershipStatusId = newStatusId;
        await user.save();

        // Fetch the new discount percentage
        const newStatus = await MembershipStatus.findByPk(newStatusId);
        return newStatus.discount_percentage;
    }

    static async createCart(userId) {
        return await Cart.create({ UserId: userId });
    }
}

module.exports = CartService;
