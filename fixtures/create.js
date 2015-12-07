'use strict';
const SqlFixtures = require('sql-fixtures');
const config = require('config');
const sqlFixtures = new SqlFixtures(config.database);

sqlFixtures.create({
  user: require('./users'),
  contact_information: require('./contact-information')
}).then(function() {
  console.log('All fixtures created.');
}).catch(function(error) {
  console.error(error);
}).finally(function() {
  sqlFixtures.destroy();
});

