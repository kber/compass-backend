const service = require('./service');
const User = require('../models/user').User;

var sampleService = service.extend({
  name: 'UserService',

  getProfile: function* (id, context){
    return yield User.findOne(id, {withRelated: ['contactInformation.location', 
    'contactInformation.phoneNumber']});
  }
});

module.exports = sampleService;
