/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is the model of the User mongoose database entry.
 */

// libraries, and getting the database connections
const { Schema } = require('mongoose');
const { dbs } = require('../../configs');

const schema = new Schema({
  // account user info
  email: String,
  password: String,
  username: String,
  firstName: String,
  lastName: String,
  // account checking
  locked: Boolean,
  disabled: Boolean,
  accountVerified: Boolean,
  // dates
  dateCreated: Date,
  dateModified: Date,
  dateLastLoggedIn: Date,
  // objects
  securityQuestions: {
    questionOne: {
      question: String,
      answer: String,
    },
    questionTwo: {
      question: String,
      answer: String,
    },
    questionThree: {
      question: String,
      answer: String,
    },
  },
  logs: [{
    time: Date,
    message: String,
  }],
});

module.exports.User = dbs.db1().model('User', schema);
