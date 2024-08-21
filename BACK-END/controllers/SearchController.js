const SearchService = require('../services/SearchService');

class SearchController {
    async searchProducts(req, res) {

        //#swagger.tags=["Product"]
        //#swagger.description="Search a product for all users guest, user, admin "
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Search a product for all users guest, user, admin',
            required: true,
            schema: {
                $ref: "#/definitions/searchProductByAllUsers"
            }
            
        }
        */
        try {
            const { name, category, brand } = req.body;
            const products = await SearchService.search(name, category, brand);
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Products found',
                    products: products,
                    count: products.length
                }
            });
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new SearchController();
