'use strict';
const log4js = require('log4js');
const levels = require('log4js/lib/levels');
const config = require('config');
const _ = require('lodash');

const appenders = [{ type: 'console' }];
if (config.util.getEnv('NODE_ENV') === 'production') {
  appenders.push({
    type: 'file',
    absolute: true,
    filename: config.log.logFileName,
    maxLogSize: config.log.maxLogSize,
    backups: config.log.backups
  });
}

log4js.configure({
  appenders: appenders,
  reloadSecs: 300
});

const HTTP_LOG_FORMAT = '[PID:%s / UID:%s / IP:%s / ClientType:%s] %d %s %s - %dms';
const REQUEST_LOG = '[PID:%s / UID:%s / IP:%s / ClientType:%s] %s';

exports.middleware = (thisLogger, options) => {
  options = options || {};

  return function* (next) {
    let request = this.request;
    let start = new Date();
    let method = request.method;

    yield next;

    let context = this.ctx;
    let resp = this.response;
    let responseTime = new Date() - start;
    let level = options.level || levels.INFO;

    if (resp.status && level === 'auto') {
      level = levels.INFO;
      if(resp.status >= 300) {
        level = levels.WARN;
      }
      if(resp.status >= 400) {
        level = levels.ERROR;
      } 
    }

    if (thisLogger.isLevelEnabled(level)) {
      thisLogger.log(level, HTTP_LOG_FORMAT, context.pid, context.user, request.ip, request.headers['x-client-type'], resp.status, method, request.url, responseTime);
      if (request.body && _.isObject(request.body) && !_.isEmpty(request.body)) {
        thisLogger.log(level, REQUEST_LOG, context.pid, context.user, request.ip, request.headers['x-client-type'], JSON.stringify(_.omit(request.body, 'password')));
      }
    }
  };
};

var logger = log4js.getLogger('bolt-backend');
logger.setLevel(config.log.logLevel);

exports.logger = logger;
