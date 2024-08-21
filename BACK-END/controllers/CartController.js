const CartService = require('../services/CartService');

class CartController {
    static async addItemToCart(req, res) {

        //#swagger.tags=["Cart"]
        //#swagger.description="A registered user can add items to cart"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'A registered user can add items to cart',
            required: true,
            schema: {
                $ref: "#/definitions/addItemToCart"
            }
            
        }
        */
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const cartItem = await CartService.addItemToCart(userId, productId, quantity);
            res.status(201).json({ status: 'success', data: cartItem });
        } catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static async getCart(req, res) {
        //#swagger.tags=["Cart"]
        //#swagger.description="A registered user can see his/her cart"
        
        try {
            const userId = req.user.id;
            const cart = await CartService.getCart(userId);
            res.status(200).json({ status: 'success', data: cart });
            console.log("cart",cart)

            //res.render('usercart', { title: 'User Cart', user: req.user, cart:cart });
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }

    static async updateCartItem(req, res) {

        //#swagger.tags=["Cart"]
        //#swagger.description="A registered user can update items in cart"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'A registered user can update items in cart',
            required: true,
            schema: {
                $ref: "#/definitions/updateCartItem"
            }
            
        }
        */
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const cartItem = await CartService.updateCartItem(userId, productId, quantity);
            res.status(200).json({ status: 'success', data: cartItem });
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static async removeItemFromCart(req, res) {

        //#swagger.tags=["Cart"]
        //#swagger.description="A registered user can remove item in cart"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'A registered user can remove item in cart',
            required: true,
            schema: {
                $ref: "#/definitions/removeItemFromCart"
            }
            
        }
        */


        try {
            const userId = req.user.id;
            const { productId } = req.body;
            await CartService.removeItemFromCart(userId, productId);
            res.status(200).json({ status: 'success', message: 'Item removed from cart' });
        } catch (error) {
            console.error('Error removing item from cart:', error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }

    static async checkoutCart(req, res) {

        //#swagger.tags=["Cart"]
        //#swagger.description="A registered user can checkout the cart"
        



        try {
            const userId = req.user.id;
            const { order, totalPrice, discountPercentage, discountAmount, finalPrice } = await CartService.checkoutCart(userId);
            res.status(200).json({
                status: 'success',
                data: {
                    order,
                    totalPrice,
                    discountPercentage,
                    discountAmount,
                    finalPrice
                }
            });
        } catch (error) {
            console.error('Error checking out cart:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = CartController;
