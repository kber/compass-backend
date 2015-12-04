const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');
const gzip = require('koa-gzip');
const log = require('./utils/log');
const bodyparser = require('koa-body');
const config = require('config');
const svcInitializer = require('./utils/service-initializer');

if (config.app.cors) {
  app.use(cors({
    origin: '*',
    headers: 'accept, x-requested-with, authorization, content-type, Cache-Control, x-client-type'
  }));
}

svcInitializer.init();
app.use(bodyparser({multipart: true}));
app.use(log.middleware(log.logger, {level: 'auto'}));
app.use(gzip());

app.use(function* (next) {
  //console.log('this is a middleware sample');
  yield next;
});

function initRoutes() {
  for (var i = 0; i < arguments.length; i++) {
    app.use(arguments[i].routes());
    app.use(arguments[i].allowedMethods());
  }
}

initRoutes(
  require('./routers/samples')
);

module.exports = app;
