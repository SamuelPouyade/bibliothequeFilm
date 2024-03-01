'use strict';

const Joi = require('joi');
const UserService = require('../services/user');
const UserController = require('../controllers/UserController');

module.exports = (server) => {
    const userService = new UserService(server);
    const userController = new UserController(userService);
    return [{
        method: 'post',
        path: '/user',
        options: {
            tags: ['api'],
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
        handler: userController.create.bind(userController)
    }, {
        method: 'get',
        path: '/users',
        options: {
            tags: ['api'],
            description: 'Récupère tous les utilisateurs',
            notes: 'Cette route permet de récuperer tous les utilisateurs',
            handler: userController.list.bind(userController),
            auth: {
                scope: ['admin', 'user']
            }
        }
    }, {
        method: 'delete',
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
            handler: userController.delete.bind(userController),
            auth: {
                scope: ['admin']
            }
        }
    }, {
        method: 'patch',
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
            handler: userController.update.bind(userController),
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
            handler: userController.login.bind(userController)
        }
    },
        {
            method: 'post',
            path: '/user/sendMailInformation',
            options: {
                tags: ['api'],
                description: 'Envoie un mail d\'information',
                notes: 'Cette route permet d\'envoyer un mail d\'information',
                validate: {
                    payload: Joi.object({
                        message: Joi.string().example('Bonjour une nouvelle fonctionnalité est sortie')
                    }),
                },
                handler: userController.sendMailInformation.bind(userController),
                auth: {
                    scope: ['admin']
                }
            }
        }]
}