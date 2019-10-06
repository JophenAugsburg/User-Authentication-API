/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * This is the model of the Account Verification mongoose database entry.
 */

// libraries, and getting the database connections
const { Schema } = require('mongoose');
const { dbs } = require('../../configs');

const schema = new Schema({
  fulfilled: Boolean,
  userId: String,
  userFirstName: String,
  userUsername: String,
  expirationDate: Date
});

module.exports.AccountVerification = dbs.db1().model('AccountVerifcation', schema);
