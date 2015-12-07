'use strict';
const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');
const gzip = require('koa-gzip');
const log = require('./lib/log');
const bodyparser = require('koa-body');
const config = require('config');
const svcInitializer = require('./lib/service-initializer');

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

const initRoutes = (...args)  => {
  for (let i = 0; i < args.length; i++) {
    app.use(args[i].routes());
    app.use(args[i].allowedMethods());
  }
}

initRoutes(
  require('./routers/samples')
);

module.exports = app;
