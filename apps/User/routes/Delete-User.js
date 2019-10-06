/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is the router file that conitains the route for deleting a user
 */

// libraries
const { graphql } = require('graphql');
const bcrypt = require('bcrypt');
const express = require('express');
// middleware and query checking method
const { checkKey } = require('../../tools');
// GraphQL typedefs (schema) and resolvers (methods)
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');

const router = express.Router();

// declare the function
let deleteDoc;

// declare / add the route
router.delete('/delete', checkKey, async (req, res) => deleteDoc(req.body, res));

// delete the user document in the database
let getUser;
let deleteUser;
deleteDoc = async (body, res) => {
  // get the parameters
  const {
    username, password
  } = body;

  // using the username passed in, get the user id and passwoord
  const result = await getUser(username);

  // check if password passed in and the password of the user match
  // if they do not, send a failure response and return out of the function
  if (!(await bcrypt.compare(password, result.password))) {
    res.send({
      status: 'failure',
      reason: 'passwords do not match'
    });
    return;
  }

  // successfully sent in the correct password
  // delete the user using it's id
  await deleteUser(result.id);

  // send a success response
  res.send({
    status: 'success'
  });
};

// get the user password and id
getUser = async username => graphql(userTypedefs,
  `{ getUserByUsername(username: "${username}") { id password } }`,
  userResolvers.Query).then(response => response.data.getUserByUsername);

// delete the user by its id
deleteUser = async id => userResolvers.Mutation.deleteUser({ id });

module.exports.routes = router;
