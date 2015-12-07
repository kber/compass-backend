module.exports.tables = {
  user: ['id', 'account_name', 'password', 'name', 'gender', 'blood_type', 'email', 
    'identity_card', 'idnetity_card_type', 'nickname', 'manifesto', 'avatar_image_id'],

  location: ['id', 'address_line1', 'address_line2', 'city', 'province', 'country',
    'zip_code', 'longtitude', 'latitude'],

  phone_number: ['id', 'number', 'ext', 'type'],

  contact_information: ['id', 'type', 'user_id', 'location_id', 'phone_number_id']
};
