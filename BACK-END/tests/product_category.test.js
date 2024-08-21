const request = require('supertest');
const { app, initializeApp, db } = require('../appTest');

// user can decide which test to run or skip
const testConfig = {
    runCreateCategoryTest: true,
    runRetrieveCategoryTest: true,
    runUpdateCategoryTest: true,
    runDeleteCategoryTest: true,
    runRetrieveDeletedCategoryTest: true,
    runCreateProductTest: true,
    runRetrieveProductTest: true,
    runUpdateProductTest: true,
    runDeleteProductTest: true,
    runCheckSoftDeletedProductTest: true
};

// Yardımcı fonksiyon
function conditionalTest(description, condition, testFn) {
    if (condition) {
        it(description, testFn);
    } else {
        it.skip(description, testFn);
    }
}

beforeAll(async () => {
    await initializeApp(); // start the app for test 
});

describe('Category and Product CRUD Operations', () => {
    let adminToken;
    let createdCategoryId;
    let createdProductId;

    beforeAll(async () => {
        // login as admin and get admin token
        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                identifier: 'Admin',
                password: 'P@ssword2023'
            });

        if (adminLoginResponse.statusCode !== 200) {
            const errorMsg = JSON.stringify(adminLoginResponse.body, null, 2);
            throw new Error(`Admin login failed: ${errorMsg}`);
        }

        adminToken = adminLoginResponse.body.data.token;
    });

    describe('Category CRUD Operations', () => {
        conditionalTest('should create a new category as admin', testConfig.runCreateCategoryTest, async () => {
            const newCategory = {
                name: 'TEST_CATEGORY'
            };

            const response = await request(app)
                .post('/category')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newCategory);

            expect(response.statusCode).toEqual(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('category');
            expect(response.body.data.category.name).toEqual('TEST_CATEGORY');

            createdCategoryId = response.body.data.category.id;
            console.log('Created Category ID:', createdCategoryId); // test log 
        });

        conditionalTest('should retrieve the created category by id', testConfig.runRetrieveCategoryTest, async () => {
            console.log('Retrieving Category ID:', createdCategoryId); // test log 

            const response = await request(app)
                .get(`/category/${createdCategoryId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            console.log('Retrieve Response:', response.body); // test log 

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('category');
            expect(response.body.data.category.id).toEqual(createdCategoryId);
            expect(response.body.data.category.name).toEqual('TEST_CATEGORY');
        });

        conditionalTest('should update the created category as admin', testConfig.runUpdateCategoryTest, async () => {
            const updatedCategory = {
                name: 'UPDATED_TEST_CATEGORY'
            };

            const response = await request(app)
                .put(`/category/${createdCategoryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updatedCategory);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('category');
            expect(response.body.data.category.name).toEqual('UPDATED_TEST_CATEGORY');
        });

        conditionalTest('should delete the created category as admin', testConfig.runDeleteCategoryTest, async () => {
            const response = await request(app)
                .delete(`/category/${createdCategoryId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('category');
            expect(response.body.data.category.id).toEqual(createdCategoryId);
        });

        conditionalTest('should not retrieve the deleted category', testConfig.runRetrieveDeletedCategoryTest, async () => {
            const response = await request(app)
                .get(`/category/${createdCategoryId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toEqual(404); // Not found
        });
    });

    describe('Product CRUD Operations', () => {
        conditionalTest('should create a new product as admin', testConfig.runCreateProductTest, async () => {
            const newProduct = {
                name: 'TEST_PRODUCT',
                description: 'This is test product created by JEST',
                price: 149.99,
                quantity: 100,
                date_added: '2024-05-17',
                imgurl: '/images/genericproduct.jpg',
                status: 'available',
                brandName: 'TEST_BRAND',
                categoryName: 'TEST_CATEGORY',
                discount: 10
            };

            const response = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newProduct);

            expect(response.statusCode).toEqual(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('product');
            expect(response.body.data.product.name).toEqual('TEST_PRODUCT');

            createdProductId = response.body.data.product.id;
            console.log('Created Product ID:', createdProductId); // test 
        });

        conditionalTest('should retrieve the created product by id', testConfig.runRetrieveProductTest, async () => {
            console.log('Retrieving Product ID:', createdProductId); // test

            const response = await request(app)
                .get(`/products/${createdProductId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            console.log('Retrieve Response:', response.body); // test

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('product');
            expect(response.body.data.product.id).toEqual(createdProductId);
            expect(response.body.data.product.name).toEqual('TEST_PRODUCT');
        });

        conditionalTest('should update the created product as admin', testConfig.runUpdateProductTest, async () => {
            const updatedProduct = {
                name: 'UPDATED_TEST_PRODUCT',
                description: 'This is updated test product created by JEST',
                price: 199.99,
                quantity: 150,
                imgurl: '/images/updatedproduct.jpg',
                status: 'available',
                brandName: 'UPDATED_TEST_BRAND',
                categoryName: 'UPDATED_TEST_CATEGORY',
                discount: 15
            };

            const response = await request(app)
                .put(`/products/${createdProductId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updatedProduct);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('product');
            expect(response.body.data.product.name).toEqual('UPDATED_TEST_PRODUCT');
        });

        conditionalTest('should delete the created product as admin', testConfig.runDeleteProductTest, async () => {
            const response = await request(app)
                .delete(`/products/${createdProductId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('product');
            expect(response.body.data.product.id).toEqual(createdProductId);
        });

        // Soft delete 
        conditionalTest('should check if the deleted product is soft deleted', testConfig.runCheckSoftDeletedProductTest, async () => {
            const response = await request(app)
                .get(`/products/${createdProductId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            console.log('Retrieve Deleted Product Response:', response.body); // test

            expect(response.statusCode).toEqual(200); // Soft deleted product
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('product');
            expect(response.body.data.product.id).toEqual(createdProductId);
            expect(response.body.data.product.deletedAt).not.toBeNull(); // Soft delete control 
        });
    });
});

afterAll(async () => {
    await db.sequelize.close();  // close connection with database
});
