
const { Product } = require('../models');
const BrandService = require('./BrandService');
const CategoryService = require('./CategoryService');
const CartItem = require('../models').CartItem;
const Category = require('../models').Category;
const Brand = require('../models').Brand;

class ProductService {
    async create(productData) {
        const { name, description, price, quantity, date_added, imgurl, status, brandName, categoryName } = productData;

        // Check if the product already exists
        const existingProduct = await Product.findOne({ where: { name } });
        if (existingProduct) {
            throw new Error('Product with this name already exists');
        }

        // Find or create the brand
        let brand = await BrandService.findByName(brandName);
        if (!brand) {
            brand = await BrandService.create({ name: brandName });
        }

        // Find or create the category
        let category = await CategoryService.findByName(categoryName);
        if (!category) {
            category = await CategoryService.create({ name: categoryName });
        }

        // Determine the product status based on quantity
        const productStatus = quantity > 0 ? 'available' : 'out-of-stock';

        // Create the product
        const newProduct = await Product.create({
            name,
            description,
            price,
            quantity,
            date_added,
            imgurl,
            status: productStatus,
            BrandId: brand.id,
            CategoryId: category.id
        });

        return newProduct;
    }

    async getAll() {
        const query = `
            SELECT 
                Products.*, 
                Brands.name AS brand, 
                Categories.name AS category 
            FROM Products
            LEFT JOIN Brands ON Products.BrandId = Brands.id
            LEFT JOIN Categories ON Products.CategoryId = Categories.id
        `;
        return await Product.sequelize.query(query, {
            type: Product.sequelize.QueryTypes.SELECT
        });
    }

    async search(name, category, brand) {
        const query = `
            SELECT 
                Products.*, 
                Brands.name AS brand, 
                Categories.name AS category 
            FROM Products
            LEFT JOIN Brands ON Products.BrandId = Brands.id
            LEFT JOIN Categories ON Products.CategoryId = Categories.id
            WHERE 
                Products.isdeleted = 0 AND 
                (Products.name LIKE :name OR 
                Categories.name LIKE :category OR 
                Brands.name LIKE :brand)
        `;
        return await Product.sequelize.query(query, {
            replacements: { name: `%${name}%`, category: `%${category}%`, brand: `%${brand}%` },
            type: Product.sequelize.QueryTypes.SELECT
        });
    }

    async update(productId, productData) {
        const { name, description, price, quantity, date_added, imgurl, brandName, categoryName, status, isDeleted, discount } = productData;
        
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Find or create the brand
        let brand = await BrandService.findByName(brandName);
        if (!brand) {
            brand = await BrandService.create({ name: brandName });
        }

        // Find or create the category
        let category = await CategoryService.findByName(categoryName);
        if (!category) {
            category = await CategoryService.create({ name: categoryName });
        }

        // Determine the product status based on quantity
        const productStatus = quantity > 0 ? 'available' : 'out-of-stock';

        // Determine the product discount
        let discountedPrice=discount ? price - (price * (discount / 100)) : price;
        discountedPrice=parseFloat(discountedPrice).toFixed(2);

        // Update the product
        await product.update({
            name,
            description,
            price: discountedPrice, //we use new price with discount or old price without discount
            quantity,
            date_added,
            imgurl,
            status: status || productStatus,
            discount:discount,
            BrandId: brand.id,
            CategoryId: category.id,
            isdeleted: isDeleted
        });

        return product;
    }

    async delete(productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.isdeleted) {
            throw new Error('Product is already deleted');
        }

        product.isdeleted = true;
        await product.save();
        return product;
    }

    // New method to undelete a product
    async undelete(productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (!product.isdeleted) {
            throw new Error('Product is not deleted');
        }

        product.isdeleted = false;
        await product.save();
        return product;
    }



    async updateProductStatus(productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Calculate the total quantity of the product considering only non-deleted cart items
        const totalCartQuantity = await CartItem.sum('quantity', {
            where: { ProductId: productId, soft_deleted: false }
        });

        // Update product status based on total cart quantity
        product.status = totalCartQuantity < product.quantity ? 'available' : 'out-of-stock';
        await product.save();

        return product;
    }

    async getById(productId) {
        return await Product.findByPk(productId, {
            include: [
                { model: Brand },
                { model: Category }
            ]
        });
    }


}

module.exports = new ProductService();
