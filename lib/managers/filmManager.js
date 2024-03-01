'use strict';



class FilmManager {
    constructor({ Film, User, UserFavorite }) {
        this.Film = Film;
        this.User = User;
        this.UserFavorite = UserFavorite;
    }

    async getAllUserEmails() {
        return this.User.query().select('mail');
    }

    async create(filmDetails) {
        return this.Film.query().insertAndFetch(filmDetails);
    }

    async list() {
        return this.Film.query().select();
    }

    async delete(id) {
        return this.Film.query().deleteById(id);
    }
    async findAllUsersEmailsByFilmId(id) {

        const users_id = await this.UserFavorite.query().select('user_id').where('film_id', id);
        const users = await this.User.query().select('mail').whereIn('id', users_id.map(user => user.user_id));
        return users.map(user => user.mail);
    }

    async update(id, filmDetails) {
        return this.Film.query().patchAndFetchById(id, filmDetails);
    }

    async getFilmByTitle(title) {
        return this.Film.query().findOne({title:  title.film_title});
    }

    async getFilmById(id) {
        return this.Film.query().findOne({id: id});
    }
}

module.exports = FilmManager;
