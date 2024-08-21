const BrandService = require('../services/BrandService');

class BrandController {
    async getAllBrands(req, res) {

        //#swagger.tags=["Brand"]
        //#swagger.description="Get all brands"
        


        try {
            const brands = await BrandService.getAll();
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Brands found',
                    brands: brands
                }
            });
        } catch (error) {
            console.error('Error fetching brands:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async createBrand(req, res) {

        //#swagger.tags=["Brand"]
        //#swagger.description="Create brand by Admin "
        //#swagger.produces=['application/json']
        /*#swagger.parameters['body']= {
            in: 'body',
            description: 'Create brand by Admin xx ',
            required: true,
            schema: {
                $ref: "#/definitions/createBrand"
            }
        }
        */



        try {
            const brandData = req.body;
            const newBrand = await BrandService.create(brandData);
            res.status(201).json({
                status: 'success',
                statuscode: 201,
                data: {
                    result: 'Brand created',
                    brand: newBrand
                }
            });
        } catch (error) {
            console.error('Error creating brand:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateBrand(req, res) {

        //#swagger.tags=["Brand"]
        //#swagger.description="Update a brand by Admin "
        //#swagger.produces=['application/json']
        /* #swagger.parameters['body']= {
            in: 'body',
            description: 'Update a brand by Admin  ',
            required: true,
            schema: {
                $ref: "#/definitions/updateBrand"
            }
        }
        */
        try {
            const brandId = req.params.id;
            const updateData = req.body;
            await BrandService.update(brandId, updateData);
            res.status(200).json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Brand updated'
                }
            });
        } catch (error) {
            console.error('Error updating brand:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteBrand(req, res) {
        //#swagger.tags=["Brand"]
        //#swagger.description="Delete a brand by Admin "
        //#swagger.produces=['application/json']
        /* #swagger.parameters['body']= {
            in: 'body',
            description: 'Delete a brand by Admin  ',
            required: true,
            schema: {
                $ref: "#/definitions/deleteBrand"
            }
        }
        */

        try {
            const brandId = req.params.id;
            const canDelete = await BrandService.canDelete(brandId);
            if (!canDelete) {
                return res.status(400).json({ message: 'Brand cannot be deleted as it is assigned to products' });
            }
            await BrandService.delete(brandId);
            res.status(200).json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Brand deleted'
                }
            });
        } catch (error) {
            console.error('Error deleting brand:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new BrandController();
