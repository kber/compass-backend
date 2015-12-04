var config = require('config');

var envName = config.util.getEnv('NODE_ENV');
var migrationConfig = {};

migrationConfig[envName] = {
  client: config.database.client,
  connection: config.database.connection
};

console.log('Running on ' + envName + ' mode.');
module.exports = migrationConfig;

