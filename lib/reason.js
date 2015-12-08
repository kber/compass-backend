'use strict';
var merge = require('merge-descriptors');

module.exports = function(app, i18nOptions, options) {

  var _options = options || {},
    _ok = _options.ok || {
        ok: true
      },
    _reason = _options.reason || {
        error: 'service not available'
      };

  merge(app.context, {
    /**
     * Set ok return.
     *
     * @param {Object} obj (optional)
     * @param {Number} status (optional)
     * @api public
     */
    ok: function(obj, status) {
      if ('number' === typeof obj) {
        status = obj;
        obj = {};
      } else {
        status = status || 200;
        obj = obj || {};
      }
      obj.ok = obj.ok || _ok.ok;
      this.status = status;
      this.body = obj;
    },
    /**
     * Set error-prone return
     *
     * @param {Object|String} errors (optional)
     * @param {Number} status (optional)
     * @api public
     */
    reason: function(errors, status) {
      var body = {}, context = this;
      if ('number' === typeof errors) {
        status = errors;
        body.error = context.i18n.__(_reason.error);
      } else {
        status = status || 500;
        if ('string' === typeof errors) {
          body.error = context.i18n.__(errors, {});
          console.log(body.error);
          return;
        } else {
          errors = errors || {};
          var keys = Object.keys(errors);
          if (keys.length > 0) {
            body.errors = keys.map(function(key) {
              return {
                field: key,
                message: context.i18n.__(errors[key])
              };
            });
          } else {
            body.error = context.i18n.__(_reason.error);
          }
        }
      }
      this.status = status;
      this.body = body;
    },

    reasoni: function(info) {
      var body = {}, context = this;
      var errors = info.message;
      var status = info.status || 500;
      var params = info.params || {};
      if ('string' === typeof errors) {
        body.error = context.i18n.__(errors, params);
      } else {
        errors = errors || {};
        var keys = Object.keys(errors);
        if (keys.length > 0) {
          body.errors = keys.map(function(key) {
            return {
              field: key,
              message: context.i18n.__(errors[key], params)
            };
          });
        } else {
          body.error = context.i18n.__(_reason.error, params);
        }
      }
      this.status = status;
      this.body = body;
    }
  });
  return app;
};
