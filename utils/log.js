const log4js = require('log4js');
const levels = require('log4js/lib/levels');
const config = require('config');

var appenders = [{ type: 'console' }];
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

const HTTP_LOG_FORMAT = '%d %s %s - %dms';

exports.middleware = function(thisLogger, options) {
  options = options || {};

  return function* (next) {
    var request = this.request;
    var start = new Date();
    var method = request.method;

    yield next;

    var resp = this.response;
    var responseTime = new Date() - start;
    var level = options.level || levels.INFO;

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
      thisLogger.log(level, HTTP_LOG_FORMAT, resp.status, method, request.url, responseTime);
    }
  };
};

const logger = log4js.getLogger('EC');
logger.setLevel(config.log.logLevel);

exports.logger = logger;
