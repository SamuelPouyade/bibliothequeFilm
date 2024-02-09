'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const Encrypt = require("iut-encrypt-samuel");

module.exports = class UserFavorite extends Model {
    static get tableName() {
        return 'user_favorites';
    }
    static get JoiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            user_id: Joi.number().integer().greater(0).example(1).description('Id of the user'),
            film_id: Joi.number().integer().greater(0).example(1).description('Id of the film'),
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