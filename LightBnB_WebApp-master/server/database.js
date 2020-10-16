// const properties = require('./json/properties.json');
// const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightBnB'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const values = [email];
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, values)
    .then(res => res.rows[0])
    .catch(err => null);

};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [id];
  return pool
    .query(`SELECT * FROM users WHERE user = $1;`, values)
    .then(res => res.rows)
    .catch(err => null);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  
  const Add_User_Query =
  `INSERT INTO users (name, password, email) 
   VALUES ($1, $2, $3) RETURNING *;`;
  return pool
    .query(Add_User_Query, [user.name, user.password, user.email])
    .then(res => res.rows[0])
    .catch(err => null);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const Reservations_Query =
  `SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
    WHERE reservations.guest_id = $1
      AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;

const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit = 10];
  return pool
    .query(Reservations_Query, values)
    .then(res => res.rows)
    .catch(err => null);
  
};
// need to get guest_id
// should be able to ref file

exports.getAllReservations = getAllReservations;


const addReservation =  function(reservation) {
  return pool.query(`
  INSERT INTO reservations (start_date, end_date, property_id, guest_id)
  VALUES($1, $2, $3, $4)
  RETURNING *; 
  `, [reservation.start_date, reservation.end_date, reservation.property_id, reservation.guest_id])
    .then(res => res.rows)
    .catch(err => console.log(err));
};
exports.addReservation = addReservation;


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
console.log(options);
  const queryParams = [];
  // 2
  let Query_String = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
    WHERE 1 = 1
  `;

  // 3 ADD AND Statments?
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    Query_String += ` AND city LIKE $${queryParams.length}`;
  }
  
  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    Query_String += ` AND owner_id =  $${queryParams.length}`;
  }
  
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    Query_String += ` AND rating > $${queryParams.length}`;
  }
  
  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night) * 100);
    Query_String += ` AND cost_per_night > $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night) * 100);
    Query_String += ` AND cost_per_night < $${queryParams.length}`;
  }
  // edge case only min price
  // edge case only max price
  // confirm not using else if ....because we want to consider all conditions


  // 4 This doesn't look like it needs to be changed ask
  queryParams.push(limit);
  Query_String += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(Query_String, queryParams);

  // 6
  return pool.query(Query_String, queryParams)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const Add_Property_Query =
`INSERT INTO properties 
(
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  street,
  city,
  province,
  post_code,
  country,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms
  )
  VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`;

const addProperty = function(property) {
  
  console.log(property);
  return pool
    .query(Add_Property_Query,
      [
        property.owner_id,
        property.title,
        property.description,
        property.thumbnail_photo_url,
        property.cover_photo_url,
        property.cost_per_night * 100,
        property.street,
        property.city,
        property.province,
        property.post_code,
        property.country,
        property.parking_spaces,
        property.number_of_bathrooms,
        property.number_of_bedrooms
      ])
    .then(res => res.rows[0])
    .catch(err => null);

};
exports.addProperty = addProperty;

