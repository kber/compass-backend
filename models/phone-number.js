'use strict';
const compassBookshelf = require('./base');
const Checkit = require('checkit');

const PhoneNumber = compassBookshelf.Model.extend({
  tableName: 'phone_number',

  constructor: function() {
    compassBookshelf.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },

  validations: {
    number: ['maxLength:20', 'alphaDash'],
    ext: ['max:99999999']
  },

  validate() {
    return new Checkit(this.validations).run(this.toJSON());
  }
});

module.exports = {
  PhoneNumber: compassBookshelf.model('PhoneNumber', PhoneNumber) 
};
