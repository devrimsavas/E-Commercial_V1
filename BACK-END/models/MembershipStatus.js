module.exports=(sequelize, DataTypes)=> {

    const MembershipStatus=sequelize.define('MembershipStatus', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discount_percentage: {
            type:DataTypes.DECIMAL(5,2),
            allowNull: false
        }
    });

    MembershipStatus.associate = (models) => {
        MembershipStatus.hasMany(models.User);
    };
    return MembershipStatus;
}