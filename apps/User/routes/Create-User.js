/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is the router file that conitains the route for creating a new user
 * Form requests are sent here for signups
 */

// libraries
const { graphql } = require('graphql');
const express = require('express');
// middleware and query checking method
const { checkKey } = require('../../tools');
// GraphQL typedefs (schema) and resolvers (methods)
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');

const router = express.Router();

// declaring the method
let createUser;

// declaring the route - adding it
router.post('/create', checkKey, async (req, res) => createUser(req.body, res));

// Create the user document
let checkForUsername;
let createUserAccount;
let checkForEmail;
createUser = async (body, res) => {
  // get the parameters
  const {
    firstName, lastName, email, username, password,
    securityQuestionOne, securityQuestionOneAnswer,
    securityQuestionTwo, securityQuestionTwoAnswer,
    securityQuestionThree, securityQuestionThreeAnswer
  } = body;

  // Check for the username for being in use
  // if it is, send them a username in use status and return out of the function
  if (!(await checkForUsername(username))) {
    res.send({
      status: 'username in use'
    });
    return;
  }

  // Check for the email for being in use
  // if it is, send them a username in use status and return out of the function
  if (!(await checkForEmail(email))) {
    res.send({
      status: 'email in use'
    });
    return;
  }

  // enter the function to create the user
  await createUserAccount(
    firstName, lastName, email, username, password,
    securityQuestionOne, securityQuestionOneAnswer,
    securityQuestionTwo, securityQuestionTwoAnswer,
    securityQuestionThree, securityQuestionThreeAnswer
  );

  // send a success reponse
  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

// Check for an existing account with that username.
checkForUsername = async (username) => {
  // query the database for the username
  const result = await graphql(userTypedefs,
    `{ getUserByUsername(username: "${username}") {id} }`,
    userResolvers.Query).then(response => response.data.getUserByUsername);
  // null or undefined if the username was not found
  if (result === null || result === undefined) {
    return true;
  }
  return false;
};

// Check for an existing account with that email.
checkForEmail = async (email) => {
  // query the database for the email
  const result = await graphql(userTypedefs,
    `{ getUserByEmail(email: "${email}") {id} }`,
    userResolvers.Query).then(response => response.data.getUserByEmail);
  // null or undefined if the email was not found
  if (result === null || result === undefined) {
    return true;
  }
  return false;
};

// Create the user.
createUserAccount = async (
  firstName, lastName, email, username, password,
  securityQuestionOne, securityQuestionOneAnswer,
  securityQuestionTwo, securityQuestionTwoAnswer,
  securityQuestionThree, securityQuestionThreeAnswer
) => {
  // in the mutation functions, create a user
  await userResolvers.Mutation.createUser({
    firstName,
    lastName,
    email,
    username,
    password,
    securityQuestionOne,
    securityQuestionOneAnswer,
    securityQuestionTwo,
    securityQuestionTwoAnswer,
    securityQuestionThree,
    securityQuestionThreeAnswer
  });
  // return the account was successfully created
  return true;
};
