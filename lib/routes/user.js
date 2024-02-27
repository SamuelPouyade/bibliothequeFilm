'use strict';

const Joi = require('joi');

module.exports = [{
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        description: 'Crée un utilisateur',
        notes: 'Cette route permet de créer un utilisateur',
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John'),
                lastName: Joi.string().required().min(3).example('Doe'),
                mail: Joi.string().required().email().example('test@example.com'),
                password: Joi.string().required().min(8).example('password123'),
                username: Joi.string().required().min(3).example('sam')
            })
        },
        auth: false
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return userService.create(request.payload);
    }
}, {
    method: 'get',
    path: '/users',
    options: {
        tags: ['api'],
        description: 'Récupère tous les utilisateurs',
        notes: 'Cette route permet de récuperer tous les utilisateurs',
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
        description: 'Supprime un utilisateur',
        notes: 'Cette route permet de supprimer un utilisateur',
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
        description: 'Met à jour un utilisateur',
        notes: 'Cette route permet de mettre à jour un utilisateur, si vous êtes admin vous pouvez mettre à jour les rôles des utilisateurs',
        validate: {
            params: Joi.object({
                id: Joi.number().required().example(1).description('Id of the user')
            }),
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John'),
                lastName: Joi.string().required().min(3).example('Doe'),
                mail: Joi.string().required().email().example('test@example.com'),
                password: Joi.string().required().min(8).example('password123'),
                username: Joi.string().required().min(3).example('sam'),
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
        description: 'Connecte un utilisateur',
        notes: 'Cette route permet de connecter un utilisateur',
        validate: {
            payload: Joi.object({
                mail: Joi.string().email().example('test@example.com'),
                password: Joi.string().min(8).example('password123')
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