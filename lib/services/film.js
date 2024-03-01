'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const MessagingService = require('./messagingService');
const { createObjectCsvWriter } = require('csv-writer');
const { join } = require('path');
const FilmManager = require("../managers/filmManager");

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
        const { User } = this.server.models();
        const filmManager = new FilmManager({ Film, User });

        const allUsers = await filmManager.getAllUserEmails();
        const allUsersEmails = allUsers.map(user => user.mail);
        const newFilm = await filmManager.create(film);

        const message = {
            type: 'newFilm',
            title: newFilm.title,
            message: `Un nouveau film, ${newFilm.title}, a été ajouté.`,
            usersEmails: allUsersEmails
        };

        await this.messagingService.publishToQueue('notificationsQueue', message);

        console.log(`Notifications en cours d'envoi pour le film ${newFilm.title}`);

        return newFilm;
    }

    async list() {
        const { Film } = this.server.models();
        const { User } = this.server.models();
        const filmManager = new FilmManager({ Film , User });

        const allFilms = await filmManager.list();

        return allFilms;
    }

    async delete(id) {
        const { Film } = this.server.models();
        const filmManager = new FilmManager({ Film});

        await filmManager.delete(id);

        return '';
    }

    async findAllUsersEmailsByFilmId(id) {
        const { UserFavorite } = this.server.models();
        const { User } = this.server.models();

        const filmManager = new FilmManager({ User, UserFavorite });

        const users = await filmManager.findAllUsersEmailsByFilmId(id);

        return users;
    }

    async update(id, film) {
        const { Film } = this.server.models();
        const filmManager = new FilmManager({ Film });
        const usersEmails = await this.findAllUsersEmailsByFilmId(id);

        const newFilm = await filmManager.update(id, film);

        console.log(usersEmails);

        const message = {
            type: 'updateFilm',
            title: newFilm.title,
            message: 'Le film, ${newFilm.title}, a été modifié.',
            usersEmails: usersEmails
        };

        await this.messagingService.publishToQueue('notificationsQueue', message);

        console.log(`Notifications en cours d'envoi pour le film ${newFilm.title}`);

        return newFilm;
    }

    async exportMoviesToCsv(userEmail) {
        try {
            const { Film } = this.server.models();

            const filmManager = new FilmManager({ Film });
            const films = await filmManager.list();

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