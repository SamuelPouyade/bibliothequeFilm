'use strict';

class userController {
    constructor(userService) {
        this.userService = userService;
    }

    async create(request, h) {
        const userDetails = request.payload;
        return this.userService.create(userDetails);
    }

    async list(request, h) {
        return await this.userService.list();
    }

    async delete(request, h) {
        const id = request.params.id;
        return await this.userService.delete(id);
    }

    async update(request, h) {
        const id = request.params.id;
        const userDetails = request.payload;
        return await this.userService.update(id, userDetails);
    }

    async login(request, h) {
        const {userService} = request.services();

        try {
            const token = await userService.login(request.payload.mail, request.payload.password);
            return h.response({token: token}).code(200);
        } catch (e) {
            return h.response(e.message).code(401);
        }
    }

    async sendMailInformation(request, h) {
        const {userService} = request.services();
        const message = request.payload;
        return await userService.sendMailInformation(message);
    }
}

module.exports = userController;