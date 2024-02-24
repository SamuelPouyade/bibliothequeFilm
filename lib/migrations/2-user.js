'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.string('scope').notNullable();
        });
    },

    async down(knex) {
        await knex.schema.table('user_favorites', table => {
            table.dropForeign('user_id');
            table.dropForeign('film_id');
        });

        await knex.schema.dropTableIfExists('user');
        await knex.schema.dropColumns('scope');
    }
};
