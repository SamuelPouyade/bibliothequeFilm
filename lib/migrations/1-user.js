'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.table('user_favorites', (table) => {
            table.dropForeign('user_id', 'user_favorites_user_id_foreign');
        });

        await knex.schema.dropTableIfExists('user');
        await knex.schema.createTable('user', (table) => {
            table.increments('id').primary();
            table.string('firstName', 255).notNullable();
            table.string('lastName', 255).notNullable();
            table.string('mail', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('username', 255).notNullable().unique();
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
