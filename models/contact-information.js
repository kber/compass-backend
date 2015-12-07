'use strict';
const compassBookshelf = require('./base');

let ContactInformation = compassBookshelf.Model.extend({
  tableName: 'contact_information',

  user() {
    return this.belongsTo('User');
  },

  phoneNumber() {
    return this.belongsTo('PhoneNumber');
  },

  location() {
    return this.belongsTo('Location');
  }
});

module.exports = {
  ContactInformation: compassBookshelf.model('ContactInformation', ContactInformation)
};
