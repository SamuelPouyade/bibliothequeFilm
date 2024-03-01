'use strict';

class filmController {
    constructor(filmService) {
        this.filmService = filmService;
    }

    async create(request, h) {
        const filmDetails = request.payload;
        return this.filmService.create(filmDetails);
    }

    async list(request, h) {
        return await this.filmService.list();
    }

    async delete(request, h) {
        const id = request.params.id;
        return await this.filmService.delete(id);
    }

    async update(request, h) {
        const id = request.params.id;
        const filmDetails = request.payload;
        return await this.filmService.update(id, filmDetails);
    }

    async exportCsv(request, h) {
        const {filmService} = request.services();
        const {userService} = request.services();

        const userMail = userService.getEmailFromRequest(request);
        await filmService.exportMoviesToCsv(userMail);

        return h.response().code(204);
    }
}

module.exports = filmController;