'use strict';

class userFavoriteManager {
    constructor({ UserFavorite }) {
        this.UserFavorite = UserFavorite;
    }

    async list() {
        return this.UserFavorite.query().select();
    }

    async getUserFavoriteByFilmIdAndUserId(film_id, user_id) {
        return this.UserFavorite.query().findOne({film_id: film_id, user_id: user_id});
    }

    async delete(id) {
        return this.UserFavorite.query().deleteById(id);
    }
}

module.exports = userFavoriteManager;