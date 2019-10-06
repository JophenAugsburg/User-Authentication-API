/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is responsible for initializing all of the MongoDB databases.
 * Returns each of the databse connections.
 */

// libraries
const mongoose = require('mongoose');
const { dbs } = require('./db_config');

// a function to return the DB1 database connection
const db1 = () => {
  mongoose.connect(dbs.db1.database, { useNewUrlParser: true });
  return mongoose;
};

// export the database connections
module.exports.dbs = {
  db1
};
