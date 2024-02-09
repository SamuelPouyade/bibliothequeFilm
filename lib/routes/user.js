'use strict';

const Joi = require('joi');
const Jwt = require('@hapi/jwt');
const User = require('../models/user');

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
        },
        auth: false
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
        },
        auth: {
            scope: ['admin', 'user']
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
        },
        auth: {
            scope: ['admin']
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
                username: Joi.string().min(3).example('samuel').description('Username of the user'),
                scope: Joi.string().example('user').description('Scope of the user')
            })
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.update(request.params.id, request.payload);
        },
        auth: {
            scope: ['admin']
        }
    }
}, {
    method: 'post',
    path: '/user/login',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                mail: Joi.string().email().example('test@example.com').description('Mail of the user'),
                password: Joi.string().min(8).example('password123').description('Password of the user')
            })
        },
        auth: false,
        handler: async (request, h) => {
            const { userService } = request.services();

            try {
                const token = await userService.login(request.payload.mail, request.payload.password);

                return token;

            } catch (error) {
                return h.response({ error: error.message }).code(400);
            }
        }
    }
}];