exports.up = (knex) => knex.schema.createTable('user', (table) => {
  table.increments();
  table.string('account_name', 255);
  table.string('password', 255);
  table.string('name', 255);
  table.string('gender', 10);
  table.string('blood_type', 10);
  table.string('email', 255);
  table.string('identity_card', 50);
  table.string('nickname', 255);
  table.string('manifesto', 2000);
  table.integer('avatar_image_id');
  table.string('created_by', 50);
  table.string('updated_by', 50);
  table.timestamps();
}).createTable('location', (table) => {
  table.increments();
  table.string('address_line1', 255);
  table.string('address_line2', 255);
  table.string('city', 255);
  table.string('province', 255);
  table.string('country', 255);
  table.string('zip_code', 50);
  table.float('longtitude', 10, 6);
  table.float('latitude', 10, 6);
  table.string('created_by', 50);
  table.string('updated_by', 50);
  table.timestamps();
}).createTable('phone_number', (table) => {
  table.increments();
  table.string('number', 20);
  table.integer('ext', 10);
  table.string('type', 50);
  table.string('created_by', 50);
  table.string('updated_by', 50);
  table.timestamps();
}).createTable('contact_information', (table) => {
  table.increments();
  table.string('type', 50);
  table.integer('user_id').unsigned();
  table.integer('location_id').unsigned();
  table.integer('phone_number_id').unsigned();
}); 

exports.down = (knex) => knex.schema.dropTable('contact_information')
.dropTable('location')
.dropTable('phoneNumber')
.dropTable('user');
