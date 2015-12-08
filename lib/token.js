'use strict';
const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('config');

exports.create = username => {
  let payload = {
    username : username,
    exp : moment().add(6, 'days').valueOf()
  };
  return jwt.encode(payload, config.app.jwtSecret, 'HS512');
};
