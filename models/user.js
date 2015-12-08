'use strict';
const compassBookshelf = require('./base');
const Checkit = require('checkit');
const _ = require('lodash');
const validationUtils = require('../lib/validation-utils');
const bcrypt = require('bcrypt');
const thenify = require('thenify');
const genSalt = thenify(bcrypt.genSalt);
const hash = thenify(bcrypt.hash);
const compare = thenify(bcrypt.compare);

const User = compassBookshelf.Model.extend({
  tableName: 'user',

  constructor() {
    compassBookshelf.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },

  validations: {
    accountName: [{rule: 'alphaUnderscore', label: 'account name'}, {rule: 'maxLength:50', label: 'account name'}],
    name: {rule: 'maxLength:255', label: 'real name'},
    gender: ['alpha'],
    identityCard: {rule: validationUtils.idCard, message: 'invalid identity card number', params:[]},
    email: ['email'],
    bloodType: [{rule: 'alphaDash', label: 'blood type'}, {rule: 'maxLength:10', label: 'blood type'}],
    manifesto: ['maxLength:140'],
    nickname: ['maxLength:255']
  },

  validate() {
    return new Checkit(this.validations).run(this.toJSON());
  },

  contactInformation() {
    return this.hasMany('ContactInformation');
  }
}, {
  hashPassword: function* (pwd) {
    if (_.isEmpty(pwd)) {
      return '';
    }

    let salt = yield genSalt();
    return yield hash(pwd, salt);
  },

  authenticate: function* (accountName, pwd) {
    let existUser = yield this.findOneByProperty({'account_name': accountName});
    if (!_.isEmpty(existUser)) {
      return yield compare(pwd, existUser.get('password')) ? existUser : null;
    } else {
      return null;
    }
  },

  isAccountNameDuplicated: function* (accountName) {
    let existUser = yield this.findOneByProperty({'account_name': accountName});
    return !_.isEmpty(existUser);
  }
});

module.exports = {
  User: compassBookshelf.model('User', User)
};
