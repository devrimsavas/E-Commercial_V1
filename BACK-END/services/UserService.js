const { User, MembershipStatus, Cart } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class UserService {
    static async create(userData) {
        const user = await User.create(userData);
        await Cart.create({ UserId: user.id });
        return user;
    }

    static async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    static async findByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    static async getAll() {
        
        return await User.findAll({
            include:[{model:MembershipStatus, as : 'MembershipStatus'}]
        })
    }

    static async findById(id) {
        return await User.findByPk(id);
    }

    static async findByUsernameOrEmail(identifier) {
        return await User.findOne({
            where: {
                [Op.or]: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        });
    }

    static async validatePassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }

    static async update(userId, updateData) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        await user.update(updateData);
        return user;
    }

    static async updateRole(userId, newRole) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        user.role = newRole;
        await user.save();
        return user;
    }

    static async delete(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        await user.destroy();
    }
}

module.exports = UserService;
