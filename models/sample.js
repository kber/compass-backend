const compassBookshelf = require('./base');

var Sample = compassBookshelf.Model.extend({
  tableName: 'samples'

  //define orm mapping here
});

module.exports = {
  Sample: compassBookshelf.model('Sample', Sample)
};
