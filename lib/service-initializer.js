const path = require('path');
const fs = require('fs');
const servicePath = path.join(__dirname, '../services');
const modelPath = path.join(__dirname, '../models');

module.exports = {
  init() {
    // Init all services
    fs.readdirSync(servicePath).forEach(function(service) {
      require('../services/' + service);
    });

    // Init all models
    fs.readdirSync(modelPath).forEach(function(model) {
      require('../models/' + model);
    });
  }
};
