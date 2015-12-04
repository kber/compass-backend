const boltBookshelf = require('./base');

var Sample = boltBookshelf.Model.extend({
  tableName: 'samples'

  //define orm mapping here
});

module.exports = {
  Sample: boltBookshelf.model('Sample', Sample)
};
