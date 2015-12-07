'use strict';
const _ = require('lodash');
const logger = require('../lib/log').logger;
const shortid = require('shortid');

const IN_APP_LOG_FORMAT = '[PID:%s / UID:%s / IP:%s / ClientType: %s] %s';

module.exports = () => {
  return function* (next) {
    if (this.session && !this.session.id) {
      this.session.id = shortid.generate();
    }

    let ipAddress = this.req.headers['x-forwarded-for'] ? this.req.headers['x-forwarded-for'] : this.req.connection.remoteAddress;
    let clientType = this.req.headers['x-client-type'];
    let ctx = this.ctx = _.merge({}, this.params, {
      user: 'SYSTEM',
      remoteIp: ipAddress,
      pid: this.session.id + '-' + (new Date()).getTime(),
      clientType: clientType,

      log: {
        trace(msg) {
          this.execLog(msg, logger.trace, 'trace');
        },
        debug(msg) {
          this.execLog(msg, logger.debug, 'debug');
        },
        info(msg) {
          this.execLog(msg, logger.info, 'info');
        },
        warn(msg) {
          this.execLog(msg, logger.warn, 'warn');
        },
        error(msg) {
          this.execLog(msg, logger.error, 'error');
        },
        fatal(msg) {
          this.execLog(msg, logger.fatal, 'fatal');
        },

        execLog(msg, method, level) {
          if (logger.isLevelEnabled(level)) {
            if (this.isValidContext(ctx)) {
              var output = msg instanceof Error ? msg.stack : msg;
              logger.log(level, IN_APP_LOG_FORMAT, ctx.pid, ctx.user, ctx.remoteIp, ctx.clientType, output);
            } else {
              method.call(logger, msg);
            }
          }
        },

        isValidContext(context) {
          return context.pid && context.user;
        }
      }
    });

    yield next;
  };
};
