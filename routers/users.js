const Router = require('koa-router');
const userService = require('../services/service').getServiceInstance('UserService');
const auth = require('../middlewares/auth');
const transaction = require('../middlewares/transaction');
const validation = require('../middlewares/validation');
const token = require('../lib/token');
const BusinessError = require('../errors/business-error');

const router = module.exports = new Router({
  prefix: '/api'
});

router
.post('/v1/users/', validation.user, transaction, registerNewUser)
.post('/v1/users/actions/login', validation.user, login)
.get('/v1/users/profile', auth.isAuthenticated, findMyProfile);

function* registerNewUser() {
  var user = yield userService.register(this.request.body, this.ctx);
  this.body = user;
  this.cookies.set('authorization', token.create(user.get('accountName')));
  this.status = 201;
}

function* login() {
  var result = yield userService.authenticate(this.request.body.accountName, this.request.body.password);
  if (!result) {
    BusinessError.badRequest({'accountName': 'Account name or password invalid, please verify and try again'}).boom();
  } else {
    var user = yield userService.getProfile(result.id, this.ctx);
    this.body = user;
    this.cookies.set('authorization', token.create(user.get('accountName')));
    this.status = 200;
  }
}

function* findMyProfile() {
  this.body = yield userService.getProfile(this.authenticatedUser.get('id'), this.ctx);
  this.status = 200;
}
