'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const Encrypt = require('iut-encrypt-samuel');
const Jwt = require('@hapi/jwt');
const MessagingService = require('./messagingService');
const UserManager = require("../managers/userManager");

module.exports = class UserService extends Service {
    constructor(server) {
        super(server);
        this.messagingService = new MessagingService(process.env.AMQP_URL);
    }

    async create(user) {
        const { User } = this.server.models();
        const userManager = new UserManager({ User });
        const newUser = await userManager.create(user);

        const message = {
            type: 'welcome',
            email: newUser.mail,
            name: newUser.firstName + ' ' + newUser.lastName
        };
        await this.messagingService.publishToQueue('notificationsQueue', message);

        return newUser;
    }

    async list(){

        const { User } = this.server.models();
        const userManager = new UserManager({ User });

        return await userManager.list();
    }

    async delete(id){

        const { User } = this.server.models();
        const userManager = new UserManager({ User });

        await userManager.delete(id);

        return '';
    }

    async update(id, user){

        const { User } = this.server.models();
        const userManager = new UserManager({ User });

        if (! await userManager.getUserById(id)) {
            throw Boom.notFound('User not found');
        }

        if (!user.password) {
            throw Boom.badRequest('Forgot our password')
        }

        await User.query().patchAndFetchById(id, user);

        return '';
    }

    async login(mail, password){

        const { User } = this.server.models();
        const userManager = new UserManager({ User });
        const user = await userManager.getUserByEmail(mail);

        if(!user){
            throw Boom.unauthorized('Invalid mail');
        } else if (!Encrypt.compareSha1(password, user.password)){
            throw Boom.unauthorized('Invalid password');
        } else {
            return this.generateToken(user);
        }
    }

    async sendMailInformation(messageUser){
        const { User } = this.server.models();
        const userManager = new UserManager({ User });
        const userMails = await userManager.getAllUserEmails();

        if(!userMails){
            throw Boom.notFound('User not found');
        }

        const message = {
            type: 'information',
            usersEmails: userMails,
            message: messageUser,
            subject: 'Information'
        };


        await this.messagingService.publishToQueue('notificationsQueue', message);

        return '';
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

    getEmailFromRequest(request) {
        try {
            const token = request.headers.authorization.split(" ")[1];
            const decoded = Jwt.token.decode(token);

            return decoded.decoded.payload.email;
        } catch (error) {
            throw Boom.unauthorized('Invalid token');
        }
    }

}
