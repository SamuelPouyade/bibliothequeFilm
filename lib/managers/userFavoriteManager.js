'use strict';

class userFavoriteManager {
    constructor({ UserFavorite }) {
        this.UserFavorite = UserFavorite;
    }

    async create(userFavoriteDetails) {
        return this.UserFavorite.query().insertAndFetch(userFavoriteDetails);
    }

    async list() {
        return this.UserFavorite.query().select();
    }

    async getUserFavoriteByFilmIdAndUserId(film_id, user_id) {
        return this.UserFavorite.query().findOne({film_id: film_id, user_id: user_id});
    }

    async delete(id) {
       return this.UserFavorite.query().delete().where('film_id', id);
    }
}

module.exports = userFavoriteManager;