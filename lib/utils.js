'use strict';
const Hashids = require('hashids');
const hashids = new Hashids('Bolt hash secret', 16, '0123456789BCDFGHJKLMNPQRSTVWXYZ');
const _ = require('lodash');

const only = (obj, keys) => {
  obj = obj || {};
  if ('string' === typeof keys) {
    keys = keys.split(/ +/);
  }

  return keys.reduce(function(ret, key) {
    if (null === obj.get(key)) {
      return ret;
    }

    ret[key] = obj.get(key);
    return ret;
  }, {});
};

exports.pad = (num, size) => {
  let result = num + '';
  while (result.length < size) {
    result = '0' + result;
  }
  return result;
};

//expose only needed user properties
exports.minimumUser = (user) => only(user, 'id accountName email firstName gender organizations identityCard phoneNumber');
exports.httpContext = (apiMethod) => apiMethod(null);

exports.hashid = (originalId) => {
  let now = new Date();
  let compositeId = (now.getTime() + originalId).toString();
  let hashedId = hashids.encode(parseInt(compositeId));
  return hashedId.toString();
};

exports.camelize = (attrs) => {
  return _.reduce(attrs, function(memo, val, key) {
    memo[_.camelCase(key)] = val;
    return memo;
  }, {});
};

exports.underscored = (attrs) => {
  return _.reduce(attrs, function(memo, val, key) {
    memo[_.snakeCase(key)] = val;
    return memo;
  }, {});
};

exports.prop = (obj, propStr) => {
  if (_.isNull(obj)) {
    return null;
  }

  let props = propStr.split('.');
  let last = props.splice(props.length - 1);

  return props.reduce(function(sofar, curr) {
    return sofar[curr] || {};
  }, obj)[last];
};

exports.path = (propStr, obj) => exports.prop(obj, propStr);

exports.strip = (str, chars) => {
  return (chars || '~!@#$%^&*()_+{}|:"<>?`-=[]\\;\',./').split('').reduce(function(sofar, curr) {
    return sofar.replace(curr, '');
  }, str || '');
};
