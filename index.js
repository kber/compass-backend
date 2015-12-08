'use strict';
const Koa = require('koa');
const app = new Koa();
const config = require('config');
const cors = require('koa-cors');
const gzip = require('koa-gzip');
const bodyparser = require('koa-body');
const i18n = require('koa-i18n');
const session = require('koa-session');
const locale = require('koa-locale');
const helmet = require('koa-helmet');
const compassError = require('./middlewares/compass-error');
const context = require('./middlewares/context');
const svcInitializer = require('./lib/service-initializer');
const reason = require('./lib/reason');
const log = require('./lib/log');
const i18nConfig = {directory: './locales', locales: ['zh-CN', 'en-US'], header: true};

if (config.app.cors) {
  app.use(cors({
    origin: '*',
    headers: 'accept, x-requested-with, authorization, content-type, Cache-Control, x-client-type'
  }));
}

locale(app);
svcInitializer.init();
app.use(gzip());
app.use(i18n(app, i18nConfig));
app.use(session(app));
app.use(bodyparser({multipart: true}));
app.use(compassError());
app.use(log.middleware(log.logger, {level: 'auto'}));
app.use(helmet());
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
