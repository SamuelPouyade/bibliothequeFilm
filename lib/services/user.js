'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const Encrypt = require('iut-encrypt-samuel');

module.exports = class UserService extends Service {

    create(user){

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }

    async list(){

        const { User } = this.server.models();

        return await User.query().select();
    }

    async delete(id){

        const { User } = this.server.models();

        await User.query().deleteById(id);

        return '';
    }

    async update(id, user){

        const { User } = this.server.models();

        return await User.query().patchAndFetchById(id, user);
    }

    async connect(mail, password){

        const { User } = this.server.models();

        const user = await User.query().findOne({mail});

        if(!user){
            throw Boom.unauthorized('Invalid mail');
        } else if (!Encrypt.compareSha1(password, user.password)){
            throw Boom.unauthorized('Invalid password');
        } else {
            return {
                login: "successful"
            }
        }
    }
}
