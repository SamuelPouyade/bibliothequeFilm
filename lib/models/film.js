'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const Encrypt = require("iut-encrypt-samuel");

module.exports = class Film extends Model {
    static get tableName() {
        return 'film';
    }
    static get JoiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('John').description('Title of the film'),
            director: Joi.string().min(3).example('Doe').description('Realisator of the film'),
            description: Joi.string().min(3).example('description').description('Description of the film'),
            release_date: Joi.date().example('1972-03-24').description('Release date of the film'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
}