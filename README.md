
# NOROFF E-Commercial App 

**Very important note please read**: 
To ensure the proper functioning of the Admin Panel in the FRONT-END section, it is crucial to configure the token secrets consistently across both folders. This configuration is essential for the smooth operation of the front-end admin panel.
- after you have installed npm module
```bash 
npm install 
```
generate a token secret using Node's crypto module:
```bash 
require('crypto').randomBytes(64).toString('hex')
```
and add this `generated_token_secret`for both env module in front and back-end env files. 

# Node version 
This application uses node version v20.10.0. Please check your node version using in command line:
```bash 
node --version
```


# Application and Folder Structure 
The purpose of this application is to imitate the roles of admin, user and visitor on a fictitious e-commerce site and to provide options according to the user's role. However, basically the Admin role is prioritized. Admin can add, delete, update or delete products. Likewise, an admin can update their order status.

# Folder Structure 
The repository here mainly consist of three sections 
- 1 BACK-END
- 2 FRONT-END 
- 3 DOCUMENTATION

## 1- BACK-END Folder Overview 
This folder contains the back-end application of the NOROFF E-Commercial App, primarily serving the admin and user response APIs. Key components and features of this folder include:
* API Services: Admin, User and Guest APIs 

* Testing and Swagger Modules: Jest Supertest and Swagger modules. (note: swagger module is located at http://localhost:3000/doc/ (in case you directly want to see all API's).

* Embedded Front-End: the Back-End folder has its own front-end view in case the user want also use app here. 

* Port Configuration: The application runs on port 3000 (be sure you have installed CORS).

Documentation: For detailed information and usage guidelines, please refer `README.md` file inside BACK-END folder and documentation folder. 

## 2- FRONT-END Folder Overview 
This folder contains the front-end Admin Panel application of the Noroff E-Commercial App, although the primary target is to provide a seperated front-end for users, it is possible to use back-end views via ports and links given in index.page. 

Documentation: For detailed information and usage guidelines, please refer `README.md` file inside FRONT-END folder and documentation folder.
* The application in this folder cannot be run alone. The app in the back-end folder must be run in the background.

* Port Configuration: The application in this folder runs on port 5000


## 3- DOCUMENTATION 
This folder contains documentation for whole application such as reflection report, database construction, challanges and problems during coding phase and some personal comments of the programmer. 


## 4- REFERENCES 
In this section, the external resources and materials used to create this application are listed. Additinally, how and what purpose these resources used are discussed in details in the **reflection report** in the DOCUMENTATION folder. 


1.	Backend by Noroff. "Database Module Introduction." YouTube Video. Accessed for learning database fundamentals.

2.	ChatGPT, OpenAI. Assistance with database modeling, and idea generation for e-commerce project development.

3.	Codeium Plugin. Used for code enhancement and error resolution during development.

4.	LinkedIn Learning. "Programming Foundations: Databases - Relationship Rules and Referential Integrity" by Simon Allardice. Course Link. Accessed for understanding database relationships.

5.	Noroff Learning Resources. T8CA25f1UKnb6Kt0X9xr. Accessed during the project for foundational learning.

6.	Udemy. "Node.js, Express, MongoDB Bootcamp" by Jonas Schmedtmann. Course Link. Accessed for practical development skills in Node.js and MongoDB.

7.	Vertabelo Blog. "ER Diagram for Online Shop." Article. Used as a reference for idea generation on commercial site structures.
