'use strict';
const jwt = require('jwt-simple');
const config = require('config');
const User = require('../models/user').User;
const BusinessError = require('../errors/business-error');
//var resouceAccess = require('../lib/resource-access');

exports.isAuthenticated = function *isAuthenticated(next) {
  let decoded;
  let authorization = this.request.body && this.request.body.authorization ||
    this.req.headers && this.req.headers.authorization ||
    this.cookies.get('authorization') ||
    this.request.query && this.request.query.authorization;

  if (typeof authorization === 'undefined') {
    BusinessError.unauthorized('loggedIn: Authentication required').boom();
  }

  try {
    decoded = jwt.decode(authorization, config.app.jwtSecret);
  } catch (err) {
    BusinessError.unauthorized('Token signature failed').boom();
  }

  if (decoded.exp <= Date.now()) {
    BusinessError.unauthorized('Token expired').boom();
  }

  this.authenticatedUser = yield User.findOneByProperty({'account_name': decoded.username}, this.boltContext);

  if (!this.authenticatedUser) {
    BusinessError.unauthorized('Authentication required').boom();
  } else {
    //resouceAccess.config(this.authenticatedUser);
  }

  if (this.boltContext) {
    this.boltContext.user = this.authenticatedUser.get('accountName');
    this.boltContext.authenticatedUser = this.authenticatedUser;
  }

  // Extend expiration for the token
  // this.set('Access-Control-Expose-Headers', 'X-Token');
  // this.set('X-Token', token.create(decoded.email));
  yield next;
};
