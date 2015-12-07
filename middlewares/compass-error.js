'use strict';
const Checkit = require('checkit');
const BusinessError = require('../errors/business-error');
const logger = require('../lib/log').logger;
const _ = require('lodash');

module.exports = () => {
  return function* (next) {
    let request = this.request;
    let requestMethod = request.method;
    let requestUrl = request.url;

    try {
      yield next;
    } catch (err) {
      if (this.ctx) {
        let requestBody = request.body;
        let errorCode = err instanceof BusinessError ? err.errorInfo.status : err.status;
        if (errorCode === 400 || errorCode === 401 || errorCode === 404) {
          this.ctx.log.warn(requestMethod + ' ' + requestUrl);
          if (requestBody && _.isObject(requestBody) && !_.isEmpty(requestBody)) {
            this.ctx.log.warn(JSON.stringify(_.omit(requestBody, 'password')));
          }
          this.ctx.log.warn(err.message);
        } else {
          this.ctx.log.error(requestMethod + ' ' + requestUrl);
          if (requestBody && _.isObject(requestBody) && !_.isEmpty(requestBody)) {
            this.ctx.log.error(JSON.stringify(_.omit(requestBody, 'password')));
          }
          this.ctx.log.error(err.stack);
        }
        if (this.ctx.transacting && this.ctx.rollback) {
          this.ctx.log.warn('Rolling back transaction...');
          this.ctx.transacting.rollback();
        }
      } else {
        logger.error(err);
      }

      this.status = err.status || 500;

      if (err instanceof Checkit.Error) {
        this.status = 400;
        this.reason(err.errors, this.status);
      } else if (err instanceof BusinessError) {
        this.reasoni(err.errorInfo);
      } else {
        this.reason('Internal Server Error', this.status);
      }
    }
  };
};
