const CategoryService = require('../services/CategoryService');

class CategoryController {
    async getAllCategories(req, res) {

        //#swagger.tags=["Category"]
        //#swagger.description="Get all Categories"
        //#swagger.produces=['application/json']


        
        try {
            const categories = await CategoryService.getAll();
            res.json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Categories found',
                    categories: categories
                }
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async createCategory(req, res) {

        //#swagger.tags=["Category"]
        //#swagger.description="Create a Category by Admin"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Create a Category by Admin',
            required: true,
            schema: {
                $ref: "#/definitions/createCategory"
            }
            
        }
        */





        try {
            const categoryData = req.body;
            const newCategory = await CategoryService.create(categoryData);
            res.status(201).json({
                status: 'success',
                statuscode: 201,
                data: {
                    result: 'Category created',
                    category: newCategory
                }
            });
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateCategory(req, res) {

        //#swagger.tags=["Category"]
        //#swagger.description="Update a  Category by Admin"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Update a  Category by Admin',
            required: true,
            schema: {
                $ref: "#/definitions/updateCategory"
            }
            
        }
        */


        try {
            const categoryId = req.params.id;
            const updateData = req.body;
            const updatedCategory = await CategoryService.update(categoryId, updateData);
            res.status(200).json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Category updated',
                    category: updatedCategory
                }
            });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteCategory(req, res) {

        //#swagger.tags=["Category"]
        //#swagger.description="Delete a  Category by Admin"
        /*#swagger.parameters['body']= {
            name: 'body',
            in: 'body',
            description: 'Delete a  Category by Admin',
            required: true,
            schema: {
                $ref: "#/definitions/deleteCategory"
            }
            
        }
        */

        




        try {
            const categoryId = req.params.id;
            const canDelete = await CategoryService.canDelete(categoryId);
            if (!canDelete) {
                return res.status(400).json({ message: 'Category cannot be deleted as it is assigned to products' });
            }
            const deletedCategory = await CategoryService.delete(categoryId);
            res.status(200).json({
                status: 'success',
                statuscode: 200,
                data: {
                    result: 'Category deleted',
                    category: deletedCategory
                }
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getCategoryById(req, res) {  // Get category by ID 

        //#swagger.tags=["Category"]
        //#swagger.description="Show a Category by ID"
        try {
            const categoryId = req.params.id;
            console.log('Fetching category with ID:', categoryId); 
            const category = await CategoryService.getById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json({
                status: 'success',
                statuscode: 200,
                data: {
                    category: category
                }
            });
        } catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();
