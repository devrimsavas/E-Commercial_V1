const axios = require('axios');
const UserService = require('./services/UserService');
const MembershipStatusService = require('./services/MembershipStatusService');
const ProductService = require('./services/ProductService');
const BrandService = require('./services/BrandService');
const CategoryService = require('./services/CategoryService');

async function initDatabase(req = null, res = null) {
    try {
        console.log('Initializing database...');

        const users = await UserService.getAll();
        if (users.length > 0) {
            console.log('Database is already populated');
            if (res) {
                return res.status(400).json({ error: 'Database is already populated' });
            }
            return;
        }

        console.log('Populating MembershipStatus table...');
        await MembershipStatusService.create({ name: 'Bronze', discount_percentage: 0 });
        await MembershipStatusService.create({ name: 'Silver', discount_percentage: 15 });
        await MembershipStatusService.create({ name: 'Gold', discount_percentage: 30 });

        console.log('Creating initial Admin user...');
        await UserService.create({
            username: process.env.INIT_ADMIN_USERNAME,
            password: process.env.INIT_ADMIN_PASSWORD,
            email: process.env.INIT_ADMIN_EMAIL,
            firstname: process.env.INIT_ADMIN_FIRSTNAME,
            lastname: process.env.INIT_ADMIN_LASTNAME,
            address: process.env.INIT_ADMIN_ADDRESS,
            telephonenumber: process.env.INIT_ADMIN_TELEPHONE,
            MembershipStatusId: 1, // Assuming 'Bronze' is the default
            role: 'admin'
        });

        console.log('Fetching initial product data...');
        const response = await axios.get('http://backend.restapi.co.za/items/products');
        console.log('Product data fetched:', response.data.data);
        const products = response.data.data;

        for (const product of products) {
            console.log(`Processing product: ${product.name}`);

            let brand = await BrandService.findByName(product.brand);
            if (!brand) {
                console.log(`Creating brand: ${product.brand}`);
                brand = await BrandService.create({ name: product.brand });
            }

            let category = await CategoryService.findByName(product.category);
            if (!category) {
                console.log(`Creating category: ${product.category}`);
                category = await CategoryService.create({ name: product.category });
            }

            console.log(`Creating product: ${product.name}`);
            await ProductService.create({
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                date_added: product.date_added,
                imgurl: product.imgurl,
                status: 'available',
                brandName: brand.name,
                categoryName: category.name
            });
        }

        console.log('Database initialized successfully');
        if (res) {
            return res.status(200).json({ message: 'Database initialized successfully' });
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        if (res) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = { initDatabase };
