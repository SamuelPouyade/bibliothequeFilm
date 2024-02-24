'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const MessagingService = require('./messagingService');
const { createObjectCsvWriter } = require('csv-writer');
const { join } = require('path');

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

    async exportMoviesToCsv(userEmail) {
        try {
            const { Film } = this.server.models();
            const films = await Film.query().select();

            if (films.length === 0) {
                throw Boom.notFound('Aucun film trouvé');
            }

            const csvFilePath = join(__dirname, '..', '..', 'exports', `movies-${Date.now()}.csv`);

            const csvWriter = createObjectCsvWriter({
                path: csvFilePath,
                header: [
                    { id: 'id', title: 'ID' },
                    { id: 'title', title: 'Title' },
                    { id: 'description', title: 'Description' },
                    { id: 'releaseDate', title: 'Release Date' },
                    { id: 'director', title: 'Director' },
                ],
            });

            await csvWriter.writeRecords(films);

            console.log('CSV file has been created:', csvFilePath);

            const message = {
                type: 'sendCsv',
                email: userEmail,
                filePath: csvFilePath,
                subject: 'Export des films',
                text: 'Veuillez trouver ci-joint l\'export des films.',
            };
            await this.messagingService.publishToQueue('notificationsQueue', message);

        } catch (error) {
            throw Boom.internal('Erreur lors de l\'export des films', error);
        }
    }
}