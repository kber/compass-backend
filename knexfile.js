'use strict';
const config = require('config');
const envName = config.util.getEnv('NODE_ENV');
let migrationConfig = {};

migrationConfig[envName] = {
  client: config.database.client,
  connection: config.database.connection
};

console.log('Running on ' + envName + ' mode.');
module.exports = migrationConfig;

