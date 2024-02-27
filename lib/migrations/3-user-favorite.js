'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.dropTableIfExists('user_favorites');
        await knex.schema.createTable('user_favorites', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.integer('film_id').unsigned().notNullable();
            table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
            table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
            table.foreign('film_id').references('id').inTable('film').onDelete('CASCADE');
            table.unique(['user_id', 'film_id']);
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('user_favorites');
    }
};
