const service = require('./service');
const User = require('../models/user').User;
const BusinessError = require('../errors/business-error');
const _ = require('lodash');

const userService = service.extend({
  name: 'UserService',

  register: function* (newUser, context) {
    if (yield User.isAccountNameDuplicated(newUser.accountName)) {
      BusinessError.badRequest({'accountName': 'Account name already in use'}).boom();
    }

    newUser.password = yield User.hashPassword(newUser.password);
    return yield User.add(newUser, context);
  },

  authenticate: function* (accountName, pwd) {
    var authenticatedUser = yield User.authenticate(accountName, pwd);
    if (_.isEmpty(authenticatedUser)) {
      BusinessError.badRequest('Account name or password invalid, please verify and try again').boom();
    } else {
      return authenticatedUser;
    }
  },

  getProfile: function* (id, context) {
    return yield User.findOne(id, _.merge({
      withRelated: [
        'contactInformation.location',
        'contactInformation.phoneNumber'
      ]
    }, context));
  }
});

module.exports = userService;
