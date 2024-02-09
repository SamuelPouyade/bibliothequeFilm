'use strict';

const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/favorites',
    options: {
        tags: ['api'],
        handler: async (request, h) => {

            const { userFavoriteService } = request.services();

            return await userFavoriteService.list();
        },
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
            validate: {
                payload: Joi.object({
                    film_title: Joi.string().example("The Godfather").description('Title of the film')
                })
            },
            handler: async (request, h) => {

                const { userFavoriteService } = request.services();

                return userFavoriteService.addFavorite(request.payload, request.auth.credentials.email);
            },
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
                    id: Joi.number().required().example(1).description('Id of the favorite')
                })
            },
            handler: async (request, h) => {

                const { userFavoriteService } = request.services();

                await userFavoriteService.delete(request.params.id, request.auth.credentials.email);

                return '';
            },
            auth: {
                scope: ['admin', 'user']
            }
        }
    }]