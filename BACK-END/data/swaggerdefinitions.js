

//this file contains swagger definitions for swagger.js 

module.exports= {
    Login: {
        $identifier:"Admin",
        $password:"P@ssword2023",
    },

    

    UserSignup: { 
        $firstname: "John",
        $lastname: "Doe",
        $username: "johndoe",
        $email: "johndoe@example.com",
        $password: "12345",
        $address: "Oslo",
        $telephonenumber: "12345678"


    },
    createBrand: {
        $name:"Swagger Brand",
        

    },

    updateBrand: {
        $name:"Swagger Updated  Brand",

    },

    deleteBrand: {
        $id: 1
    },

    createCategory: {
        $name:"Swagger Category",
    },

    updateCategory: {
        $name:"Swagger Updated Category",
    },

    deleteCategory: {
        $id: 1
    },

    searchProduct: {
        $name:"iPhone",
        $category:"Phones",
        $brand:"Apple"
    },

    createProduct: {
        $name:"Swagger Product",
        $description:"Swagger Description",
        $price: 1000,
        $quantity: 10,
        $date_added: "2022-01-01",
        $imgurl: "https://example.com/image.jpg",
        $status:"available",
        $brandName:"Swagger Brand",
        $categoryName:"Swagger Category",
        $discount:4
    },

    updateProduct: {
        $name:"Swagger New  Product",
        $description:"Swagger Description",
        $price: 1000,
        $quantity: 10,
        $date_added: "2022-01-01",
        $imgurl: "https://example.com/image.jpg",
        $status:"available",
        $brandName:"Swagger Brand",
        $categoryName:"Swagger Category",
        $discount:4,
        $isDeleted:0
    },

    updateUserByAdmin: {
        $firstname: "Swagger John",
        $lastname: "Swagger Doe",
        $username: "johndoe",
        $email: "johndoe@example.com",
        
        $address: "Oslo",
        $telephonenumber: "12345678",
        $role: "user",
        $MembershipStatusId: 1,
        $createdAt: "2022-01-01",
        $updatedAt: "2022-01-01",
       
    },

    updateUserRoleByAdmin: {
        "role":"admin"
    },

    addItemToCart: {
        $productId: 6,
        $quantity: 8
    },

    updateCartItem: {
        $productId: 6,
        $quantity: 8
    },

    removeItemFromCart: {
        $productId: 6
    },

    updateOrderStatus: {
        $status:"ordered",
        $orderId: 1
    },

    getOrderId: {
        $orderId: 1
    },
    searchProductByAllUsers: {
        $name:"iPhone 6s Plus 16Gb",
    },

    frontadminlogin: {
        $identifier:"Admin",
        $password:"P@ssword2023",
    }

    
}