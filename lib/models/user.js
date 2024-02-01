'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const Encrypt = require('iut-encrypt-samuel');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            mail: Joi.string().email().example('test@example.com').description('Mail of the user'),
            password: Joi.string().min(8).example('samuel').description('Password of the user'),
            username: Joi.string().min(3).example('samuel').description('Username of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;

        if(this.password){
            this.password = Encrypt.sha1(this.password);
        }
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();

        if (this.password) {
            this.password = Encrypt.sha1(this.password);
        }
    }

};