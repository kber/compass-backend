const Hashids = require('hashids');
const hashids = new Hashids('Bolt hash secret', 16, '0123456789BCDFGHJKLMNPQRSTVWXYZ');
const _ = require('lodash');

exports.pad = function(num, size) {
  var result = num + '';
  while (result.length < size) {
    result = '0' + result;
  }
  return result;
};

function only(obj, keys) {
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
}

//expose only needed user properties
exports.minimumUser = function(user) {
  return only(user, 'id accountName email firstName gender organizations identityCard phoneNumber');
};

exports.httpContext = function(apiMethod) {
  apiMethod(null);
};

exports.hashid = function(originalId) {
  var now = new Date();
  var compositeId = (now.getTime() + originalId).toString();
  var hashedId = hashids.encode(parseInt(compositeId));
  return hashedId.toString();
};

exports.camelize = function(attrs) {
  return _.reduce(attrs, function(memo, val, key) {
    memo[_.camelCase(key)] = val;
    return memo;
  }, {});
};

exports.underscored = function(attrs) {
  return _.reduce(attrs, function(memo, val, key) {
    memo[_.snakeCase(key)] = val;
    return memo;
  }, {});
};

exports.prop = function(obj, propStr) {
  if (_.isNull(obj)) {
    return null;
  }

  var props = propStr.split('.');
  var last = props.splice(props.length - 1);

  return props.reduce(function(sofar, curr) {
    return sofar[curr] || {};
  }, obj)[last];
};

exports.path = function(propStr, obj) {
  return exports.prop(obj, propStr);
};

exports.strip = function(str, chars) {
  return (chars || '~!@#$%^&*()_+{}|:"<>?`-=[]\\;\',./').split('').reduce(function(sofar, curr) {
    return sofar.replace(curr, '');
  }, str || '');
};
