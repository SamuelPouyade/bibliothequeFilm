'use strict';

class userFavoriteController {
constructor(userFavoriteService) {
        this.userFavoriteService = userFavoriteService;
    }

    async addFavorite(request, h) {
        return await this.userFavoriteService.addFavorite(request.payload, request.auth.credentials.email);
    }

    async list(request, h) {
        const {userService} = request.services();
        const userMail = userService.getEmailFromRequest(request);
        return await this.userFavoriteService.list(userMail);
    }

    async delete(request, h) {
        await this.userFavoriteService.delete(request.params.id, request.auth.credentials.email);
        return '';
    }
}

module.exports = userFavoriteController;