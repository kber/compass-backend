'use strict';

var validator = require('validator');

exports.accountName = function *(next) {
    var data = this.request.body;
    if (!!data.accountName) {
        yield next;
    } else {
        return this.reason({
                'accountName': 'Account Name is required'
            }, 400
        );
    }
};

exports.verificationCode = function *(next) {
    var data = this.request.body;
    if (!!data.verificationCode) {
        yield next;
    } else {
        return this.reason({
                'verificationCode': 'Verification Code is required'
            }, 400
        );
    }
};

exports.email = function *(next) {
    var data = this.request.body;

    if (!data.email) {
        return this.reason({
                'email': 'Email is required'
            }, 400
        );
    }

    if (!validator.isEmail(data.email)) {
        return this.reason({
                'email': 'Invalid email'
            }, 400
        );
    }

    yield next;

};


exports.password = function *password(next) {
    var data = this.request.body;

    if (!data.password) {
        return this.reason({
                'password': 'Password is required'
            }, 400
        );
    }
    if (!!data.password && data.password.length < 6) {
        return this.reason({
                'password': 'The length of password less than 6'
            }, 400
        );
    }

    yield next;
};


// Chains of username and password
exports.user = function *(next) {
    yield exports.accountName
        .call(this, exports.password
            .call(this, next));
};

// Chains of username and verification code
exports.sms = function *(next) {
    yield exports.accountName
        .call(this, exports.verificationCode
            .call(this, next));
};
