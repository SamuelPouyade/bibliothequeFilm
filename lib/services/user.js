'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const Encrypt = require('iut-encrypt-samuel');
const Jwt = require('@hapi/jwt');
const MessagingService = require('./messagingService');

module.exports = class UserService extends Service {
    constructor(server) {
        super(server);
        this.messagingService = new MessagingService(process.env.AMQP_URL);
    }

    async create(user) {
        const { User } = this.server.models();
        const newUser = await User.query().insertAndFetch(user);

        const message = {
            type: 'welcome',
            email: newUser.mail, // Utilisez 'mail' au lieu de 'email'
            name: newUser.firstName + ' ' + newUser.lastName // Construisez 'name' à partir de 'firstName' et 'lastName'
        };
        await this.messagingService.publishToQueue('notificationsQueue', message);

        return newUser;
    }

    async list(){

        const { User } = this.server.models();

        return await User.query().select();
    }

    async delete(id){

        const { User } = this.server.models();

        await User.query().deleteById(id);

        return '';
    }

    async update(id, user){

        const { User } = this.server.models();

        return await User.query().patchAndFetchById(id, user);
    }

    async login(mail, password){

        const { User } = this.server.models();

        const user = await User.query().findOne({mail});

        if(!user){
            throw Boom.unauthorized('Invalid mail');
        } else if (!Encrypt.compareSha1(password, user.password)){
            throw Boom.unauthorized('Invalid password');
        } else {
            return this.generateToken(user);
        }
    }

    generateToken(user){
        const token = Jwt.token.generate({
            aud: 'urn:audience:iut',
            iss: 'urn:issuer:iut',
            sub: user.id,
            email: user.mail,
            scope: user.scope
        }, {
            key: 'random_string',
            algorithm: 'HS256'
        }, {
            ttlSec: 14400
        });

        return token;
    }


}
