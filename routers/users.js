const Router = require('koa-router');
const userService = require('../services/service').getServiceInstance('UserService');
const auth = require('../middlewares/auth');
const transaction = require('../middlewares/transaction');
const validation = require('../middlewares/validation');
const token = require('../lib/token');

const router = module.exports = new Router({
  prefix: '/api'
});

router
.post('/v1/users/', validation.user, transaction, registerNewUser)
.post('/v1/users/actions/login', validation.user, login)
.get('/v1/users/profile', auth.isAuthenticated, findMyProfile);

const attachToken = user => {
  return {
    token: token.create(user.get('accountName')),
    user: user
  };
};

function* registerNewUser() {
  var user = yield userService.register(this.request.body, this.ctx);
  this.body = attachToken(user);
  this.status = 201;
}

function* login() {
  var user = this.request.body;
  var loginUser = yield userService.authenticate(user.accountName, user.password);
  this.body = attachToken(loginUser);
  this.status = 200;
}

function* findMyProfile() {
  this.body = yield userService.getProfile(this.authenticatedUser.get('id'), this.ctx);
  this.status = 200;
}
