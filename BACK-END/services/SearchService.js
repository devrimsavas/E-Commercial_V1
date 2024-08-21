const { sequelize } = require('../models');

class SearchService {
    static async search(name, category, brand) {
        let query = `
            SELECT 
                Products.*, 
                Brands.name AS brand, 
                Categories.name AS category 
            FROM Products
            LEFT JOIN Brands ON Products.BrandId = Brands.id
            LEFT JOIN Categories ON Products.CategoryId = Categories.id
            WHERE 1=1
        `;

        const replacements = {};

        if (name) {
            query += ' AND Products.name LIKE :name';
            replacements.name = `%${name}%`;
        }
        if (category) {
            query += ' AND Categories.name = :category';
            replacements.category = category;
        }
        if (brand) {
            query += ' AND Brands.name = :brand';
            replacements.brand = brand;
        }

        const products = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        return products;
    }
}

module.exports = SearchService;
