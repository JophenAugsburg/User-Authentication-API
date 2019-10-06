/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This folder handles the different database connection URLs.
 * You are able to include many other database urls.
 * The URLs are in the .env files, under "Databases"
 */

require('dotenv').config();

// export the database URLs
module.exports.dbs = {
  db1: {
    database: process.env.MONGO_DB_1_URL
  },
};
