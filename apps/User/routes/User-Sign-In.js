/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This handles the function of updating the user documents.
 *
 * This is responsible for handling the user authentication.
 */

// libraries and other helpers
const bcrypt = require('bcrypt');
const { graphql } = require('graphql');
const express = require('express');
const { checkKey } = require('../../tools');
// GraphQL resolvers and typedefs
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');
// helpers for account management
const {
  lockAccount, updateLogs, updateLastLogged
} = require('../../Account-Helpers/Account-Helpers-exports');

const router = express.Router();

// declare functions
let userSignIn;

// declare routes
router.post('/sign-in', checkKey, async (req, res) => userSignIn(req.body, res));

// helper functions for the userSignIn
let getUser;
let checkAccount;
let updateDatabase;
// function to handle the route
userSignIn = async (body, res) => {
  // using the username parameter and values requests, find the user
  const userVals = await getUser(body.username, body.values);

  // if the username is not found
  // send a password do not match failure, with more being username not found
  if (userVals === null) {
    res.send({
      status: 'failure',
      reason: 'passwords do not match',
      more: [
        'username not found'
      ]
    });
    return;
  }

  // destructure the values to make easier use of
  const {
    id, disabled, locked, password, logs
  } = userVals;

  // since the username was found, and we have the password
  // check if the user-signed-in one and saved password are the same
  // if not, enter the if statement
  if (!(await bcrypt.compare(body.password, password))) {
    // send a lock account request, which will check if there has been 3 failed logins within
    // a specified time (.env file), and lock the account - set 'locked' to true
    await lockAccount(id, logs, true);
    // update the logs with a failed login log
    await updateLogs(id, 'authentication', 2);
    // sned the user back a failure
    res.send({
      status: 'failure',
      reason: 'passwords do not match'
    });
    return;
  }

  // next check the account for it being disabled to locked
  const check = await checkAccount(id, disabled, locked);

  // run through the check account options
  // disabled comes first, since it's more important
  // check if disabled -> if so send a accout disabled message
  if (check === 'disabled') {
    res.send({
      status: 'failure',
      reason: 'account disabled'
    });
    return;
  }
  // chekc if locked -> if so send a account locked message
  if (check === 'locked') {
    res.send({
      status: 'failure',
      reason: 'account disabled'
    });
    return;
  }

  // Finally! they have logged in successfully, so update the database with this
  // get the user's last time successfully logged in
  const lastLogged = await updateDatabase(id);

  // do not send them back the password hash or logs
  userVals.password = undefined;
  userVals.logs = undefined;
  // update the last time logged in value
  userVals.lastLogged = lastLogged;
  // send them a success message with the values
  res.send({
    status: 'success',
    values: userVals
  });
};

module.exports.routes = router;

// get the user values. Get what is requested in values, but also always get:
// logs, password, locked, disabled and id.
// these are used in the rest of the login function
getUser = async (username, values) => {
  // search the databse for a user by their username
  const result = await graphql(userTypedefs,
    `query{ getUserByUsername(username: "${username}") { ${values} logs password locked disabled id } }`,
    userResolvers.Query).then(response => response.data.getUserByUsername);

  // return the graphql response
  return result;
};

// check the account for it being locked or disabled
// additionally do a few database log updates
checkAccount = async (id, disabled, locked) => {
  // if either locked or disabled
  if (locked || disabled) {
    // declare number -> used in logs
    let number;
    // if disabled, get log message 4 otherwise log message 3 for locked
    if (disabled) {
      number = 4;
    } else {
      number = 3;
    }
    // Update the user's logs using the message number
    await updateLogs(id, 'authentication', number);
  }

  // send back what happened -> if they were disabled, locked or successful
  if (locked) {
    if (disabled) {
      return 'disabled';
    }
    return 'locked';
  }

  return 'login successful';
};

// update the database, and get he users last logged in date
updateDatabase = async (id) => {
  // update the users logs with a successfully logged in log message
  await updateLogs(id, 'authentication', 1);

  // Update the user's last logged in and return their last time logged in
  return updateLastLogged(id);
};
