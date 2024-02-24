
exports.up = function(knex) {
    return knex.schema.table('film', function(table) {
        table.date('release_date').after('description');
    });
};


exports.down = function(knex) {

    return knex.schema.table('film', function(table) {
        table.dropColumn('release_date');
    });
};

