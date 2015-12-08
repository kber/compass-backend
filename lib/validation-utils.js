const idCardValidator = require('cn-id-card-validator');
const Checkit = require('checkit');
const moment = require('moment');
const _ = require('lodash');

module.exports = {
  idCard(value) {
    return idCardValidator.validate(value);
  },

  dateString(value) {
    return moment(value).isValid();
  },

  booleanValue(value) {
    return value === 1 || value === 0 || _.isBoolean(value);
  },

  url(value) {
    var temp = (value.indexOf('http://') === -1 && value.indexOf('https://') === -1) ? 'http://' + value : value;
    return Checkit.Regex.url.test(temp.replace(/\s/g, ''));
  }
};
