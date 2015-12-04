'use strict';

var SqlFixtures = require('sql-fixtures'),
  config = require('config'),
  sqlFixtures = new SqlFixtures(config.database);

sqlFixtures.create({
  samples: require('./samples')
}).then(function() {
  console.log('All fixtures created...');
}).catch(function(error) {
  console.error(error);
}).finally(function() {
  sqlFixtures.destroy();
});

