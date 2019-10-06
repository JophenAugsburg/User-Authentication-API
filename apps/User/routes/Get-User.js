/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is the router file that conitains the routes for all Getter requests
 * Url's are redirected to these methods and they send back the data
 */

// libraries
const { graphql } = require('graphql');
const express = require('express');
// middleware and query checking method
const { checkKey, checkQuery } = require('../../tools');
// GraphQL typedefs (schema) and resolvers (methods)
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');

const router = express.Router();

// declare the methods
let getUserById;
let getUserByUsername;
let getUserByEmail;
let getUsers;
let removePasswordQuery;

// decalre the routes
router.get('/id', checkKey, async (req, res) => getUserById(req.body, res));
router.get('/username', checkKey, async (req, res) => getUserByUsername(req.body, res));
router.get('/email', checkKey, async (req, res) => getUserByEmail(req.body, res));
router.get('/all', checkKey, async (req, res) => getUsers(req.body, res));

// Get the User by its ID
getUserById = async (body, res) => {
  // remove 'password' if included from the values param
  const values = removePasswordQuery(body.values);

  // make the GraphQL query
  const result = await graphql(userTypedefs,
    `{ getUserById(id: "${body.id}") { ${values} } }`,
    userResolvers.Query).then(response => response.data);

  // check the query for null or undefeined
  // I.E not found
  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUserById);
};

// Get the User by its Username
getUserByUsername = async (body, res) => {
  // remove 'password' if included from the values param
  const values = removePasswordQuery(body.values);

  // make the GraphQL query
  const result = await graphql(userTypedefs,
    `{ getUserByUsername(username: "${body.username}") { ${values} } }`,
    userResolvers.Query).then(response => response.data);

  // check the query for null or undefeined
  // I.E not found
  if (checkQuery(result, res)) {
    return;
  }
  result.getUserByUsername.password = undefined;
  res.send(result.getUserByUsername);
};

// Get the User by its Email
getUserByEmail = async (body, res) => {
  // remove 'password' if included from the values param
  const values = removePasswordQuery(body.values);

  // make the GraphQL query
  const result = await graphql(userTypedefs,
    `{ getUserByEmail(email: "${body.email}") { ${values} } }`,
    userResolvers.Query).then(response => response.data);

  // check the query for null or undefeined
  // I.E not found
  if (checkQuery(result, res)) {
    return;
  }
  result.getUserByEmail.password = undefined;
  res.send(result.getUserByEmail);
};

// Get all of the Users
getUsers = async (body, res) => {
  // remove 'password' if included from the values param
  const values = removePasswordQuery(body.values);

  // make the GraphQL query
  const result = await graphql(userTypedefs,
    `{ getUsers { ${values} } }`,
    userResolvers.Query).then(response => response.data);

  // check the query for null or undefeined
  // I.E not found
  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUsers);
};

module.exports.routes = router;

// if the password is being requested in the query, remove it
// do not allow for the password to be returned
removePasswordQuery = (valuesQuery) => {
  let values = valuesQuery;
  if (valuesQuery.includes('password')) {
    const valA = valuesQuery.split(' ');
    valA.splice(valA.indexOf('password'), 1);
    values = valA.join(' ');
  }
  return values;
};
