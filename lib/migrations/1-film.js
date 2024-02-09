'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.alterTable('film', (table) => {
            table.dropColumns('realisator');
            table.string('director').notNull();
        });
    },

    async down(knex) {
        await knex.schema.dropColumns('scope');
    }
};
