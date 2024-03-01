'use strict';

class userManager {
    constructor({ User }) {
        this.User = User;
    }

    async create(userDetails) {
        return this.User.query().insertAndFetch(userDetails);
    }

    async list() {
        return this.User.query().select();
    }

    async delete(id) {
        return this.User.query().deleteById(id);
    }

    async update(id, userDetails) {
        return this.User.query().patchAndFetchById(id, userDetails);
    }

    async getUserByEmail(email) {
        return this.User.query().findOne({mail: email});
    }

    async getUserById(id) {
        return this.User.query().findOne({id: id})
    }
}

module.exports = userManager;