'use strict';
const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');
const gzip = require('koa-gzip');
const log = require('./lib/log');
const bodyparser = require('koa-body');
const i18n = require('koa-i18n');
const session = require('koa-session');
const i18nConfig = {directory: './locales', locales: ['zh-CN', 'en-US'], header: true};
const compassError = require('./middlewares/compass-error');
const context = require('./middlewares/context');
const reason = require('./lib/reason');
const config = require('config');
const svcInitializer = require('./lib/service-initializer');

if (config.app.cors) {
  app.use(cors({
    origin: '*',
    headers: 'accept, x-requested-with, authorization, content-type, Cache-Control, x-client-type'
  }));
}

svcInitializer.init();
app.use(i18n(app, i18nConfig));
app.use(session(app));
app.use(bodyparser({multipart: true}));
app.use(compassError());
app.use(log.middleware(log.logger, {level: 'auto'}));
app.use(gzip());
app.use(context());

reason(app);
app.keys = ['compass top secret :)'];
app.proxy = true;

const initRoutes = (...args)  => {
  for (let i = 0; i < args.length; i++) {
    app.use(args[i].routes());
    app.use(args[i].allowedMethods());
  }
}

initRoutes(
  require('./routers/users')
);

module.exports = app;
