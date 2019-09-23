const { Schema } = require('mongoose');
const { dbs } = require('../../configs');

const schema = new Schema({
  locked: Boolean,
  disabled: Boolean,
  accountVerified: Boolean,
  email: String,
  password: String,
  username: String,
  firstName: String,
  lastName: String,
  dateCreated: Date,
  dateModified: Date,
  dateLastLoggedIn: Date,
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
  logs: [{}],
});

module.exports.User = dbs.db1().model('User', schema);
