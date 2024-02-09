'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const Encrypt = require('iut-encrypt-samuel');
const Jwt = require('@hapi/jwt');

module.exports = class UserFavoriteService extends Service {

    async addFavorite(film_title, user_mail){

        const { UserFavorite } = this.server.models();
        const {user, film, favorite} = await this.canModify(user_mail, film_title, UserFavorite);
        if (favorite) {
            throw Boom.badRequest('Film already in favorite');
        } else {
            return UserFavorite.query().insert({user_id: user.id, film_id: film.id});
        }
    }

    async canModify(user_mail, film_title, UserFavorite) {
        const {User} = this.server.models();
        const {Film} = this.server.models();
        const user = await User.query().findOne({mail: user_mail});
        const film = await Film.query().findOne({title: film_title.film_title});
        const favorite = await UserFavorite.query().findOne({film_id: film.id, user_id: user.id});
        return {user, film, favorite};
    }

    async list(){

        const { UserFavorite } = this.server.models();

        return await UserFavorite.query().select();
    }

    async delete(id, user_mail){

        const { UserFavorite } = this.server.models();
        const {User} = this.server.models();
        const user = await User.query().findOne({mail: user_mail});
        const film = await UserFavorite.query().findOne({id});
        const favorite = await UserFavorite.query().findOne({film_id: film.film_id, user_id: user.id});

        if (!favorite) {
            throw Boom.notFound('Favorite not found');
        } else {
            await UserFavorite.query().deleteById(id);
        }

        return '';
    }
}
