const { Brand, Product } = require('../models');

class BrandService {
    static async create(brandData) {
        return await Brand.create(brandData);
    }

    static async findByName(name) {
        return await Brand.findOne({ where: { name } });
    }

    static async getAll() {
        return await Brand.findAll();
    }

    static async update(brandId, updateData) {
        return await Brand.update(updateData, {
            where: { id: brandId }
        });
    }

    static async delete(brandId) {
        return await Brand.destroy({
            where: { id: brandId }
        });
    }

    static async canDelete(brandId) {
        const products = await Product.findAll({
            where: { BrandId: brandId }
        });
        return products.length === 0;
    }
}

module.exports = BrandService;

