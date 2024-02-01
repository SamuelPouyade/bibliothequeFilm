'use strict';

const crypto = require('crypto');

class Encrypt {
    static sha1(password) {
        return crypto.createHash('sha1').update(password, 'utf8').digest('hex');
    }

    static compareSha1(inputPassword, hashedPassword) {
        const inputHashed = this.sha1(inputPassword);
        return inputHashed === hashedPassword;
    }
}

module.exports = Encrypt;
