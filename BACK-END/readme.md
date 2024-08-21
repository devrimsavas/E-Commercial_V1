
# NOROFF E-Commerce Application Back-End 

## Application Overview 

This folder includes all essential APIs for the Noroff e-commerce application along with an embedded front-end. It includes back-end servers designed to update or delete products, categories, and brands, as well as modify the order status for users with the user role. Additionally, the user (not admin) can buy, update,delete products or he/she can checks his/her cart These operations facilitate the display of products sourced from Noroff's specified address. For comprehensive details on all APIs, please refer to the Swagger documentation available at http://localhost:3000/doc.
The back-end APIs can be tested with POSTMAN or just use Swagger provided in this folder. 
**In order to run the seperated front-app in FRONT-END folder, you need to run this app first**


## Application Installation and Usage Instructions
This document provides basic instructions on how to install and use the application. 

- 1 Clone the Repesitory and install necessary modules by using 
```bash 
npm start 
```
will install necessary packages. 

- 2 Environment Configuration: Ensure you have `.env` file with all necessary environment variables. `.env_example.txt` file should be taken as reference.
- 3 Database and Tables Setup: When the application is launched, the initRoute function will automatically populate the database with products from the Noroff address if the database is initially empty. To reset the database, modify the line in the app.js file:
```bash 
db.sequelize.sync({ force: true }).then(async () => {
``` 

## Environment Variables 

As discussed in the main folder's README file, it is critically important to correctly set up the environment files. The TOKEN_SECRET value specified in these files must be consistent across both the front-end and the back-end environments, as this is essential for the operation of the front-end app. However, the embedded front-end in this folder will function regardless.

In the .env file in back-end folder:

- The first group of parameters provides the credentials for the database.
- The second group of parameters, starting with INIT_ADMIN, configures the admin credentials in the database.
- Here provided a sample .env example for user 
```bash 
ADMIN_USERNAME = <your_database_user>
ADMIN_PASSWORD = <database_admin_password>
DATABASE_NAME = <your_database_name>
DIALECT = "mysql"
DIALECTMODEL = "mysql2"
PORT = "3000"
HOST = "localhost"



TOKEN_SECRET=<your_token_secret>

# New admin credentials environment variables
INIT_ADMIN_USERNAME = "Admin"
INIT_ADMIN_PASSWORD = "P@ssword2023"
INIT_ADMIN_EMAIL = "admin@noroff.no"
INIT_ADMIN_FIRSTNAME = "Admin"
INIT_ADMIN_LASTNAME = "Support"
INIT_ADMIN_ADDRESS = "Online"
INIT_ADMIN_TELEPHONE = "911"

``` 

## Additional Libraries/Packages 
After cloning the repository and running npm install, it is expected that the necessary packages will be installed locally, creating the node_modules directory. However, ensure that the following packages are installed correctly:

-   **Node**: In this application node version v20.10.0 is used.
-   **Express**: A fast, unopinionated, minimalist web framework for Node.js, essential for handling HTTP requests and structuring the application.
-   **EJS**: A templating language that lets you generate HTML markup with plain JavaScript, providing an efficient way to render dynamic content on web pages.
-   **Sequelize**: A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server. It supports transactions, relations, eager and lazy loading, read replication, and more.
-   **JSON WEB TOKENS**: Simple, unobtrusive authentication for Node.js. This application uses the **JWT** for authentication with a username and password.
-   **MySQL/MySQL2**: These packages are used for interacting with MySQL databases, allowing the application to store and manage data efficiently.
-   **Bootstrap**: Provides a nice css for html. 
-   **Dotenv**: Loads environment variables from a **.env** file into **process.env**, securing application configuration.
-   **Bcrypt**: A library to help you hash passwords, enhancing the security of user information.



## JWT Middleware 

The user will see two different JWT files located in the middleware folder, each serving a distinct function:
 - auth.js: This file handles authentication for the APIs in the back-end folder. It verifies user credentials and provides the necessary access control for secure interaction with the back-end.
 - mockauth.js: It manages admin credentials required for operating the standalone front-end located within this back-end folder and supports the independent operation of the front-end in the Front-End folder, which is designed to function entirely without dependency on service files.


## app.js and appTest.js Files 
The user will also notice that are are 2 different `app` files: `app.js` and `appTest.js`. Fudamentally, it will be seen that these two files are almost the same, but with a very important nuance: 

`app.js`initializes the application immediately when user runs app but `appTest.js` does not starts application immediately it allows manual executation. This approach in `appTest.js`provides better control for Jest. More details are discussed in reflection report. 

## Jest Supertest 
the application has its own test-suits: under tests folder, you will find 2 tests. they are login.test.js and product_category.test.js. Inorder to run these tests correctly, be sure:
in main folder app.js 

```bash
db.sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced');
``` 
'force:false' is necessary to run tests correctly. 

if you want to see test details please run test in command line 
```bash
npm test -- --verbose 
```



## Embedded Front-Page inside Back-End Folder

If the user does not want to use the interface in the FRONT-END folder, he/ she  can use the interface in the Back-End folder (this folder). Actually, they both have the same interface. However, the interface here is not completely independent of sequelize services. There is also an interface for non-admin users, but it is not fully functional. The purpose here is to provide a basis for future developments.

When the application is started, the http://localhost:3000/ page, that is, the home page, will offer the user 3 options: Admin, normal user and visitor views. For example, if the user is already logged in as admin, he can go directly to the admin page and so can the user.






