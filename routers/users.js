const Router = require('koa-router');
const userService = require('../services/service').getServiceInstance('UserService');

const router = module.exports = new Router({
  prefix: '/api'
});

router
.get('/v1/users/profile', findMyProfile);

function* findMyProfile() {
  this.body = yield userService.getProfile(1);
  this.status = 200;
}


