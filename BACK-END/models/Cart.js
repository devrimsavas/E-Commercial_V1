

module.exports=(sequelize,DataTypes)=> {
    const Cart=sequelize.define('Cart', {
        status: {
            type:DataTypes.ENUM('active', 'completed'),
            allowNull: false,
            defaultValue: 'active'
        }
    });

    Cart.associate = (models) => {
        Cart.belongsTo(models.User);
        Cart.hasMany(models.CartItem);
    };

    return Cart;
}