const { Category, Product } = require('../models');

class CategoryService {
    static async create(categoryData) {
        return await Category.create(categoryData);
    }

    static async findByName(name) {
        return await Category.findOne({ where: { name } });
    }

    static async getAll() {
        return await Category.findAll();
    }

    static async update(categoryId, updateData) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        return await category.update(updateData);
    }

    static async delete(categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        return await category.destroy();
    }

    static async canDelete(categoryId) {
        const products = await Product.findAll({
            where: { CategoryId: categoryId }
        });
        return products.length === 0;
    }

    static async getById(categoryId) {  // Get category by ID method
        return await Category.findByPk(categoryId);
    }


}




module.exports = CategoryService;
