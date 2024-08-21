const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telephonenumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type:DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        }
    }, 
    {
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    User.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    User.associate=(models)=> {
        User.hasMany(models.Cart);
        User.hasMany(models.Order);
        //User.hasMany(models.OrderItem);
        //User.hasMany(models.CartItem);
        //User.hasMany(models.Product);
        User.belongsTo(models.MembershipStatus);
    }

    return User;
}
