
module.exports=(sequelize,DataTypes)=> {
    const OrderItem=sequelize.define('OrderItem', {
        quantity: {
            type:DataTypes.INTEGER,
            allowNull:false
        },
        unit_price: {
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
        }
    });

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order);
        OrderItem.belongsTo(models.Product);
    };

    return OrderItem;
}