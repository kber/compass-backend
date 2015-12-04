exports.up = function(knex, Promise) {
  return knex.schema.createTable('samples', function(table){
    table.increments();
    table.string('name', 255);
    table.string('desc', 2000);
    table.timestamps();
  }); 
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('samples');
};
