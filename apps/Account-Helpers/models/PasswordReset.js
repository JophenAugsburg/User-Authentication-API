/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * This is the model of the Password Reset mongoose database entry.
 */

// libraries, and getting the database connections
const { Schema } = require('mongoose');
const { dbs } = require('../../configs');

const schema = new Schema({
  fulfilled: Boolean,
  userId: String,
  expirationDate: Date
});

module.exports.PasswordReset = dbs.db1().model('PasswordReset', schema);
