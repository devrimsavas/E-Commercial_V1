module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date_added: {
            type: DataTypes.DATE,
            allowNull: false
        },
        imgurl: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('available', 'out-of-stock'),
            allowNull: false,
            defaultValue: 'available'
        },
        isdeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        discount : {
          type:DataTypes.DECIMAL(5, 2),
          allowNull:false,
          defaultValue:0.00
        },
    });
  
    Product.associate = (models) => {
        Product.belongsTo(models.Brand,);
        Product.belongsTo(models.Category);
        Product.hasMany(models.CartItem);
        Product.hasMany(models.OrderItem);
    };
  
    return Product;
  }
  