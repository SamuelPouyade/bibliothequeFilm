'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const Encrypt = require('iut-encrypt-samuel');
const Jwt = require('@hapi/jwt');
const UserManager = require("../managers/userManager");
const FilmManager = require("../managers/filmManager");
const UserFavoriteManager = require("../managers/userFavoriteManager");

module.exports = class UserFavoriteService extends Service {

    async addFavorite(film_title, user_mail){

        const { UserFavorite } = this.server.models();
        const userFavoriteManager = new UserFavoriteManager({UserFavorite});
        const {user, film, favorite} = await this.canModify(user_mail, film_title);
        if (favorite) {
            throw Boom.badRequest('Film already in favorite');
        } else {
            return await userFavoriteManager.create({film_id: film.id, user_id: user.id});
        }
    }

    async canModify(user_mail, film_title) {
        const {User} = this.server.models();
        const {Film} = this.server.models();
        const {UserFavorite} = this.server.models();
        const userManager = new UserManager({User});
        const filmManager = new FilmManager({Film});
        const userFavoriteManager = new UserFavoriteManager({UserFavorite});
        const user = await userManager.getUserByEmail(user_mail);
        const film = await filmManager.getFilmByTitle(film_title);
        const favorite = await userFavoriteManager.getUserFavoriteByFilmIdAndUserId(film.id, user.id);
        return {user, film, favorite};
    }

    async list(){

        const { UserFavorite } = this.server.models();
        const userFavoriteManager = new UserFavoriteManager({UserFavorite});

        return await userFavoriteManager.list();
    }

    async delete(id, user_mail){

        const { UserFavorite } = this.server.models();
        const {User} = this.server.models();
        const {Film} = this.server.models();

        const userFavoriteManager = new UserFavoriteManager({UserFavorite});
        const userManager = new UserManager({User});
        const filmManager = new FilmManager({Film});

        const user = await userManager.getUserByEmail(user_mail);
        const film = await filmManager.getFilmById(id);

        const favorite = await userFavoriteManager.getUserFavoriteByFilmIdAndUserId(film.id, user.id);
        if (!favorite) {
            throw Boom.notFound('Favorite not found');
        } else {
            await userFavoriteManager.delete(id);
        }

        return '';
    }
}
