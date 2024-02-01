'use strict';

const Joi = require('joi')

module.exports = [{
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                mail: Joi.string().required().email().example('test@example.com').description('Mail of the user'),
                password: Joi.string().required().min(8).example('samuel').description('Password of the user'),
                username: Joi.string().required().min(3).example('samuel').description('Username of the user')
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.create(request.payload);
    }
}, {
    method: 'get',
    path: '/users',
    options: {
        tags: ['api'],
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.list();
        }
    }
}, {
    method:'delete',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().required().example(1).description('Id of the user')
            })
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.delete(request.params.id);
        }
    }
}, {
    method:'patch',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().required().example(1).description('Id of the user')
            }),
            payload: Joi.object({
                firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                mail: Joi.string().email().example('test@example.com').description('Mail of the user'),
                password: Joi.string().min(8).example('samuel').description('Password of the user'),
                username: Joi.string().min(3).example('samuel').description('Username of the user')
            })
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.update(request.params.id, request.payload);
        }
    }
}, {
    method: 'post',
    path: '/user/connect',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                mail: Joi.string().email().example('test@example.com').description('Mail of the user'),
                password: Joi.string().min(8).example('samuel').description('Password of the user')
            })
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.connect(request.payload.mail, request.payload.password);
        }
    }
}];