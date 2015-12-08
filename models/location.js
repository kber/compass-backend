'use strict';
const compassBookshelf = require('./base');
const Checkit = require('checkit');

const Location = compassBookshelf.Model.extend({
  tableName: 'location',

  constructor: function() {
    compassBookshelf.Model.apply(this, arguments);
    this.on('saving', this.validate.bind(this));
  },

  validations: {
    addressLine1: ['maxLength:255'],
    addressLine2: ['maxLength:255'],
    zipCode: ['maxLength:10']
  },

  validate() {
    return new Checkit(this.validations).run(this.toJSON());
  },

  toString() {
    var self = this;
    let province = this.get('areas').find(function(area) {
      return area.get('id').toString() === self.get('province');
    });
    let city = province.get('subAreas').find(function(subArea) {
      return subArea.get('id').toString() === self.get('city');
    });

    let addStr = province.get('name');
    if (city) {
      addStr += city.get('name');
    }
    if (this.get('addressLine1')) {
      addStr += this.get('addressLine1');
    }
    return addStr;
  }
});

module.exports = {
  Location: compassBookshelf.model('Location', Location)
};
