'use strict';
const _ = require('lodash');

module.exports = {
  options: {},

  services: [],

  extend(svc) {
    let svcInstance = _.extend({}, this, svc);
    this.addServiceInstance(svcInstance);
    return svcInstance;
  },

  getServiceInstance(name) {
    let svc = _.findWhere(this.services, {'name': name});
    if (_.isEmpty(svc)) {
      return null;
    } else {
      return svc.instance;
    }
  },

  addServiceInstance(svc) {
    if (_.isEmpty(this.getServiceInstance(svc.name))) {
      this.services.push({'name': svc.name, 'instance': svc});
    }
  }
};
