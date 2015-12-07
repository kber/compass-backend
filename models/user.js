'use strict';
const compassBookshelf = require('./base');

let User = compassBookshelf.Model.extend({
  tableName: 'user',

  contactInformation() {
    return this.hasMany('ContactInformation');
  }
});

module.exports = {
  User: compassBookshelf.model('User', User)
};
