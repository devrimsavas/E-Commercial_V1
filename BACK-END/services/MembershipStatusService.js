const { MembershipStatus } = require('../models');

class MembershipStatusService {
    static async create(data) {
        return await MembershipStatus.create(data);
    }

    static async getAll() {
        return await MembershipStatus.findAll();
    }
}

module.exports = MembershipStatusService;
