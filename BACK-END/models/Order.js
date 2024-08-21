module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        orderNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('in process', 'ordered', 'completed'),
            allowNull: false,
            defaultValue: 'in process'
        }
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User);
        Order.hasMany(models.OrderItem);
    };

    return Order;
}
