'use strict';

const Joi = require('joi');
const FilmController = require('../controllers/FilmController');
const FilmService = require('../services/film');

module.exports = (server) => {
    const filmService = new FilmService(server);
    const filmController = new FilmController(filmService);
    return [{
        method: 'GET',
        path: '/films',
        options: {
            tags: ['api'],
            description: 'Récupère tous les films',
            notes: 'Cette route permet de récuperer tous les films',
            handler: filmController.list.bind(filmController),
            auth: {
                scope: ['admin', 'user']
            }
        }
    },
        {
            method: 'POST',
            path: '/films',
            options: {
                tags: ['api'],
                description: 'Crée un film',
                notes: 'Cette route permet de créer un film',
                validate: {
                    payload: Joi.object({
                        title: Joi.string().required().min(3).example('The Godfather'),
                        director: Joi.string().required().min(3).example('Francis Ford Coppola'),
                        description: Joi.string().required().example('Description du film'),
                        release_date: Joi.date().required().example('1972-03-24')
                    })
                },
                handler: filmController.create.bind(filmController),
                auth: {
                    scope: ['admin']
                }
            }
        },
        {
            method: 'DELETE',
            path: '/films/{id}',
            options: {
                tags: ['api'],
                description: 'Supprime un film',
                notes: 'Cette route permet de supprimer un film',
                validate: {
                    params: Joi.object({
                        id: Joi.number().required().example(1)
                    })
                },
                handler: filmController.delete.bind(filmController),
                auth: {
                    scope: ['admin']
                }
            }
        },
        {
            method: 'PATCH',
            path: '/films/{id}',
            options: {
                tags: ['api'],
                description: 'Met à jour un film',
                notes: 'Cette route permet de mettre à jour un film',
                validate: {
                    params: Joi.object({
                        id: Joi.number().required().example(1)
                    }),
                    payload: Joi.object({
                        title: Joi.string().min(3).example('The Godfather'),
                        director: Joi.string().min(3).example('Francis Ford Coppola'),
                        description: Joi.string().min(3).example('Description du film'),
                        release_date: Joi.date().example('1972-03-24')
                    })
                },
                handler: filmController.update.bind(filmController),
                auth: {
                    scope: ['admin']
                }
            }
        }, {
        method: 'GET',
        path: '/films/csv',
        options: {
            tags: ['api'],
            description: 'Exporte les films au format CSV',
            notes: 'Cette route permet d\'exporter les films au format CSV',
            handler: filmController.exportCsv.bind(filmController),
            auth: {
                scope: ['admin']
            }
        }
    }]
}