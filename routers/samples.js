const Router = require('koa-router');
const sampleService = require('../services/service').getServiceInstance('SampleService');

const router = module.exports = new Router({
  prefix: '/api'
});

router
.get('/v1/samples', findSamples);

function* findSamples() {
  this.body = yield sampleService.findAllSamples();
  this.status = 200;
}

