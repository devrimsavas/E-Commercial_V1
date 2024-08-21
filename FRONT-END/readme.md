
# NOROFF E-Commerce Application Front-End

## Application Overview 

This folder hosts a distinct admin front-end interface and essential routers, aimed at providing an independent interface that utilizes APIs from the Back-End folder. The application is accessible via the interface at http://localhost:5000/. Although it is  designed to display the admin interface, it also includes a homepage link for user and visitor access at (http://localhost:3000/).


**In order to run the front-app in FRONT-END folder, you need to run back-end app first**


## Application Installation and Usage Instructions
This document provides basic instructions on how to install and use the application. 

- 1 Clone the Repesitory and install necessary modules by using 
```bash 
npm start 
```
will install necessary packages. 

- 2 Environment Configuration: Ensure you have `.env` file with all necessary environment variables. `.env_example` file should be taken as reference.

## Environment Variables 

As discussed in the main folder's README file, it is critically important to correctly set up the environment files. The TOKEN_SECRET value specified in these files must be consistent across both the front-end and the back-end environments, as this is essential for the operation of the front-end app. However, the embedded front-end in this folder will function regardless.

In the .env file:
```bash 
TOKEN_SECRET=<same_as_you_use_in_back-end> 
```
- here is given a sample .env example 
```bash 
PORT = "5000"
HOST = "localhost"
TOKEN_SECRET=<your_token_same_as_backend>
```


## Additional Libraries/Packages 
After cloning the repository and running npm install, it is expected that the necessary packages will be installed locally, creating the node_modules directory. However, ensure that the following packages are installed correctly:

-   **Express**: A fast, unopinionated, minimalist web framework for Node.js, essential for handling HTTP requests and structuring the application.
-   **EJS**: A templating language that lets you generate HTML markup with plain JavaScript, providing an efficient way to render dynamic content on web pages.
-   **JSON WEB TOKENS**: Simple, unobtrusive authentication for Node.js. This application uses the **JWT** for authentication with a username and password.
-   **Bootstrap**: Provides a nice css for html. 
-   **Dotenv**: Loads environment variables from a **.env** file into **process.env**, securing application configuration.
-   **Axios** : Axios is utilized in the application to efficiently fetch data from the backend, facilitating the management and handling of HTTP requests.


## JWT Middleware (mockauth.js)

 - mockauth.js: It manages admin credentials required for operating the standalone front-end located within this back-end folder and supports the independent operation of the front-end in the Front-End folder, which is designed to function entirely without dependency on service files.



## Admin Front-End Interface 

The application initializes on the index.js page. If you are already logged in as an admin, you will be directed to the Admin Dashboard. If not, the page will display an alert prompting you to log in using the admin credentials to access the admin panel.








