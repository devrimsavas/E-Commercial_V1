const UserService = require('../services/UserService');

class UserController {
    static async getAllUsers(req, res) {

        //#swagger.tags=["User"]
        //#swagger.description="Get all users by Admin"
        



        try {
            const users = await UserService.getAll();
            res.status(200).json({
                status: 'success',
                data: users
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async getUserDetails(req, res) {

        //#swagger.tags=["User"]
        //#swagger.description="User gets his/her details"
        




        try {
            const userId = req.user.id;
            const user = await UserService.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({
                status: 'success',
                data: user
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async updateUser(req, res) {

        //#swagger.tags=["User"]
        //#swagger.description="Admin updates user details. try not to use it for admin, otherwise, It will not be possible to login as admin"
        //#swagger.produces=['application/json']
        /*#swagger.parameters['body']= {
            in: 'body',
            description: 'Admin updates user details',
            required: true,
            schema: {
                $ref: "#/definitions/updateUserByAdmin"
            }
        }
        */


        try {
            const userId = req.params.id;
            const updateData = req.body;
            const updatedUser = await UserService.update(userId, updateData);
            res.status(200).json({
                status: 'success',
                message: `User with id ${userId} and username ${updatedUser.username} updated successfully`,
                data: updatedUser
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async updateUserRole(req, res) {

        //#swagger.tags=["User"]
        //#swagger.description="Admin updates user role"
        //#swagger.produces=['application/json']
        /*#swagger.parameters['body']= {
            in: 'body',
            description: 'Admin updates user role',
            required: true,
            schema: {
                $ref: "#/definitions/updateUserRoleByAdmin"
            }
        }
        */
        try {
            const userId = req.params.id;
            const { role } = req.body;
            const updatedUser = await UserService.updateRole(userId, role);
            res.status(200).json({
                status: 'success',
                message: `User with id ${userId} and username ${updatedUser.username} role updated to ${role} successfully`,
                data: updatedUser
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteUser(req, res) {

        //#swagger.tags=["User"]
        //#swagger.description="Admin deletes a user"
        //#swagger.produces=['application/json']
        


        try {
            const userId = req.params.id;
            await UserService.delete(userId);
            res.status(200).json({
                status: 'success',
                message: `User with id ${userId} deleted successfully`
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;
