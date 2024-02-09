'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class FilmService extends Service {
    create(film) {
       const { Film } = this.server.models();

       return Film.query().insertAndFetch(film);
    }

    async list() {
        const { Film } = this.server.models();

        return await Film.query().select();
    }

    async delete(id) {
        const { Film } = this.server.models();

        await Film.query().deleteById(id);

        return '';
    }

    async update(id, film) {
        const { Film } = this.server.models();

        return await Film.query().patchAndFetchById(id, film);
    }
}