'use strict';

const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/films',
    options: {
        tags: ['api'],
        handler: async (request, h) => {

            const { filmService } = request.services();

            return await filmService.list();
        },
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
        validate: {
            payload: Joi.object({
                title: Joi.string().required().min(3).example('The Godfather').description('Title of the film'),
                director: Joi.string().required().min(3).example('Francis Ford Coppola').description('Director of the film'),
                description: Joi.string().required().example('Description du film').description('description of the film'),
                release_date: Joi.date().required().example('1972-03-24').description('Release date of the film')
            })
        },
        handler: async (request, h) => {

            const { filmService } = request.services();

            return filmService.create(request.payload);
        },
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
        validate: {
            params: Joi.object({
                id: Joi.number().required().example(1).description('Id of the film')
            })
        },
        handler: async (request, h) => {

            const { filmService } = request.services();

            await filmService.delete(request.params.id);

            return '';
        },
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
        validate: {
            params: Joi.object({
                id: Joi.number().required().example(1).description('Id of the film')
            }),
            payload: Joi.object({
                title: Joi.string().min(3).example('The Godfather').description('Title of the film'),
                director: Joi.string().min(3).example('Francis Ford Coppola').description('Director of the film'),
                description: Joi.string().min(3).example('Description du film').description('Description of the film'),
                release_date: Joi.date().example('1972-03-24').description('Release date of the film')
            })
        },
        handler: async (request, h) => {

            const { filmService } = request.services();

            return await filmService.update(request.params.id, request.payload);
        },
        auth: {
            scope: ['admin']
        }
    }
}, {
        method: 'GET',
        path: '/films/csv',
        options: {
            tags: ['api'],
            handler: async (request, h) => {
                const {filmService} = request.services();
                const {userService} = request.services();

                const userMail = userService.getEmailFromRequest(request);
                await filmService.exportMoviesToCsv(userMail);

                return '';
            },
            auth: {
                scope: ['admin']
            }
        }
}]