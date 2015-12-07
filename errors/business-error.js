'use strict';
const _ = require('lodash');
const sprintf = require('sprintf');
const ERROR_MSG = 'You\'re experiencing unexpected errorInfo, please contact HEEYLA for support.';

const BusinessError = function(errorInfo){
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = 'BusinessError';
  if (_.isString(errorInfo.message)) {
    this.message = errorInfo.message || ERROR_MSG;
  } else if (_.isObject(errorInfo.message) && !_.isArray(errorInfo.message)) {
    this.message = errorInfo.message[Object.keys(errorInfo.message)[0]] || ERROR_MSG;
  } else {
    this.message = ERROR_MSG;
  }

  this.message = sprintf(this.message, errorInfo.params);
  this.errorInfo = errorInfo;
};

BusinessError.prototype = Object.create(Error.prototype);
BusinessError.prototype.constructor = BusinessError;

//const Builder = () => {};
class Builder {
  message(theMessage) {
    this.theMessage = theMessage;
    return this;
  }

  fileds(theMessage) {
    this.message(theMessage);
    return this;
  }

  field(theField, theMessage) {
    if (!this.theMessage || _.isString(this.theMessage)) {
      this.theMessage = {};
    }
    this.theMessage[theField] = theMessage;
    return this;
  }

  params(theParams) {
    this.theParams = theParams;
    return this;
  }

  param(key, value) {
    if (!this.theParams) {
      this.theParams = {};
    }
    this.theParams[key] = value;
    return this;
  }

  status(theStatus) {
    this.theStatus = theStatus;
    return this;
  }

  boom() {
    throw new BusinessError({
      message: this.theMessage,
      params: this.theParams,
      status: this.theStatus
    });
  }
}
BusinessError.builder = () => new Builder();

BusinessError.message = message => {
  let builder =  new Builder();
  builder.message(message);
  return builder;
};

BusinessError.field = (field, message) => {
  let builder =  new Builder();
  builder.field(field, message);
  return builder;
};

BusinessError.fields = message => BusinessError.message(message);

BusinessError.status = (status, message) => {
  let builder =  new Builder();
  builder.status(status);
  if (message) {
    builder.message(message);
  }
  return builder;
};

const statusFactory = status => (message => BusinessError.status(status, message));

BusinessError.badRequest = statusFactory(400);
BusinessError.unauthorized = statusFactory(401);
BusinessError.notFound = statusFactory(404);
BusinessError.serverError = statusFactory(500);

module.exports = BusinessError;
