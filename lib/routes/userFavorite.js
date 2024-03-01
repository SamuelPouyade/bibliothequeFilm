'use strict';

const Joi = require('joi');
const UserFavoriteService = require('../services/userFavorite');
const UserFavoriteController = require('../controllers/UserFavoriteController');

module.exports = (server) => {
    const userFavoriteService = new UserFavoriteService(server);
    const userFavoriteController = new UserFavoriteController(userFavoriteService);
    return [{
        method: 'GET',
        path: '/favorites',
        options: {
            tags: ['api'],
            description: 'Récupère tous les favoris',
            notes: 'Cette route permet de récuperer tous les favoris de son compte',
            handler: userFavoriteController.list.bind(userFavoriteController),
            auth: {
                scope: ['admin', 'user']
            }
        }
    },
        {
            method: 'POST',
            path: '/favorites',
            options: {
                tags: ['api'],
                description: 'Ajoute un favori',
                notes: 'Cette route permet d\'ajouter un favori à son compte',
                validate: {
                    payload: Joi.object({
                        film_title: Joi.string().example("The Godfather")
                    })
                },
                handler: userFavoriteController.addFavorite.bind(userFavoriteController),
                auth: {
                    scope: ['admin', 'user']
                }
            }
        },
        {
            method: 'DELETE',
            path: '/favorites/{id}',
            options: {
                tags: ['api'],
                validate: {
                    params: Joi.object({
                        id: Joi.number().required().example(1)
                    })
                },
                handler: userFavoriteController.delete.bind(userFavoriteController),
                auth: {
                    scope: ['admin', 'user']
                }
            }
        }]
}