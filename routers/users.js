const Router = require('koa-router');
const userService = require('../services/service').getServiceInstance('UserService');
const auth = require('../middlewares/auth');
const transaction = require('../middlewares/transaction');

const router = module.exports = new Router({
  prefix: '/api'
});

router
.get('/v1/users/profile', auth.isAuthenticated, transaction, findMyProfile);

function* findMyProfile() {
  this.body = yield userService.getProfile(this.authenticatedUser.get('id'), this.ctx);
  this.status = 200;
}


