const request = require('supertest');
const { app, initializeApp, db } = require('../appTest');

// this function helps the user for test. The user can decide which test to run or skip.
function conditionalTest(description, condition, testFn) {
    if (condition) {
        it(description, testFn);
    } else {
        it.skip(description, testFn);
    }
}

// configuration
const testConfig = {
    runValidLoginTest: true,
    runInvalidLoginTest: true
};

beforeAll(async () => {
    await initializeApp(); // it starts the app with initialized database
});

describe('Login API', () => {
    let adminToken;

    conditionalTest('should login with valid credentials', testConfig.runValidLoginTest, async () => {
        // Login with valid credentials
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

        expect(adminLoginResponse.statusCode).toEqual(200);
        expect(adminLoginResponse.body).toHaveProperty('data');
        expect(adminLoginResponse.body.data).toHaveProperty('token');
        adminToken = adminLoginResponse.body.data.token;
    });

    conditionalTest('should fail to login with invalid credentials', testConfig.runInvalidLoginTest, async () => {
        // Login with invalid credentials
        const invalidLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                identifier: 'InvalidUser',
                password: 'WrongPassword'
            });

        expect(invalidLoginResponse.statusCode).toEqual(400); // Expected status code 400 (Bad Request)
        expect(invalidLoginResponse.body).toHaveProperty('message', 'Invalid username/email or password');
    });
});

afterAll(async () => {
    await db.sequelize.close();  // close the database connection after all tests are done
});
