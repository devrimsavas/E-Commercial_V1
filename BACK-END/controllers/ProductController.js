const ProductService = require('../services/ProductService');

class ProductController {
    async getAllProducts(req, res) {

        //#swagger.tags=["Product"]
        //#swagger.description="Show all products"
        
        try {
            const products = await ProductService.getAll();
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Products found',
                    products: products
                }
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductById(req, res) {

        //#swagger.tags=["Product"]
        //#swagger.description="Get product by id"
        
        try {
            const productId = req.params.id;
            const product = await ProductService.getById(productId);
            if (!product) {
                return res.status(404).json({ status: 'fail', message: 'Product not found' });
            }
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    product: product
                }
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async searchProducts(req, res) {

        //#swagger.tags=["Product"]
        //#swagger.description="Search products by name, category, and brand"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Search products by name, category, and brand',
            required: true,
            schema: {
                $ref: "#/definitions/searchProduct"
            }
            
        }
        */
        try {
            const { name, category, brand } = req.body;
            const products = await ProductService.search(name, category, brand);
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Products found',
                    products: products
                }
            });
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async createProduct(req, res) {

        //#swagger.tags=["Product"]
        //#swagger.description="Create a Product by Admin"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Create a Product by Admin',
            required: true,
            schema: {
                $ref: "#/definitions/createProduct"
            }
            
        }
        */
        try {
            const productData = req.body;
            const newProduct = await ProductService.create(productData);
            res.status(201).json({
                status: 'success',
                statuscode: 201,
                data: {
                    result: 'Product created successfully',
                    product: newProduct
                }
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {

        //#swagger.tags=["Product"]
        //#swagger.description="Update a Product by Admin"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Update a Product by Admin',
            required: true,
            schema: {
                $ref: "#/definitions/updateProduct"
            }
            
        }
        */

        try {
            const productId = req.params.id;
            const productData = req.body;
            const updatedProduct = await ProductService.update(productId, productData);
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Product updated successfully',
                    product: updatedProduct
                }
            });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {

        //#swagger.tags=["Product"]
        //#swagger.description="Delete a Product by Admin"
        


        try {
            const productId = req.params.id; 
            const deletedProduct = await ProductService.delete(productId);
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Product deleted successfully',
                    product: deletedProduct
                }
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: error.message });
        }
    }

        //  method to undelete a product
        async undeleteProduct(req, res) {

            //#swagger.tags=["Product"]
            //#swagger.description="Undelete a Product by Admin"
            
            try {
                const productId = req.params.id;
                const undeletedProduct = await ProductService.undelete(productId);
                res.json({
                    status: 'success',
                    statuscode: 200,
                    data: {
                        result: 'Product undeleted successfully',
                        product: undeletedProduct
                    }
                });
            } catch (error) {
                console.error('Error undeleting product:', error);
                res.status(500).json({ message: error.message });
            }
        }


}

module.exports = new ProductController();
