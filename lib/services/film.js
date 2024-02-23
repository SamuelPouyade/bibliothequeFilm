'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const userServices = require('./user');
const MessagingService = require('./messagingService');

module.exports = class FilmService extends Service {
    constructor(server) {
        super(server);
        this.messagingService = new MessagingService(process.env.AMQP_URL);
    }

    async getAllUserEmails() {
        const { User } = this.server.models();
        const users = await User.query().select('mail');
        return users.map(user => user.mail);
    }

    async create(film) {
        const { Film } = this.server.models();

        const usersEmails = await this.getAllUserEmails();

        const newFilm = await Film.query().insertAndFetch(film);

        const message = {
            type: 'newFilm',
            title: newFilm.title,
            message: `Un nouveau film, ${newFilm.title}, a été ajouté.`,
            usersEmails: usersEmails
        };

        await this.messagingService.publishToQueue('notificationsQueue', message);

        console.log(`Notifications en cours d'envoi pour le film ${newFilm.title}`);

        return newFilm;
    }

    async list() {
        const { Film } = this.server.models();

        return await Film.query().select();
    }

    async delete(id) {
        const { Film } = this.server.models();

        await Film.query().deleteById(id);

        return '';
    }

    async findAllUsersEmailsByFilmId(id) {
        const { UserFavorite } = this.server.models();
        const { User } = this.server.models();
        const users_id = await UserFavorite.query().select('user_id').where('film_id', id);
        const users = await User.query().select('mail').whereIn('id', users_id.map(user => user.user_id));


        return users.map(user => user.mail);
    }

    async update(id, film) {
        const { Film } = this.server.models();

        const usersEmails = await this.findAllUsersEmailsByFilmId(id);

        const updateFilm =  await Film.query().patchAndFetchById(id, film);

        console.log(usersEmails);

        const message = {
            type: 'updateFilm',
            title: updateFilm.title,
            message: 'Le film, ${newFilm.title}, a été modifié.',
            usersEmails: usersEmails
        };

        await this.messagingService.publishToQueue('notificationsQueue', message);

        console.log(`Notifications en cours d'envoi pour le film ${updateFilm.title}`);

        return updateFilm;
    }
}