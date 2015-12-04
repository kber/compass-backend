const service = require('./service');
const Sample = require('../models/sample').Sample;

var sampleService = service.extend({
  name: 'SampleService',

  findAllSamples: function* () {
    return yield Sample.findAll();
  }
});

module.exports = sampleService;

