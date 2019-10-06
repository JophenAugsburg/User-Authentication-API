/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 *
 * This is the routes and helper function file for updating the accounts last time logged in
 * If they was to do this via the api, send the post request to '/update-last-logged-in'
 *
 * May never be used, but the option is there
 * Primarily used for updating the user's last time logged in when they sign in
 */

// libraries and helper functions
const express = require('express');
const { checkKey, updateLastLogged } = require('../../tools');

const router = express.Router();

// declare route function
let updateLogged;

// declare route
router.post('/update-last-logged-in', checkKey, async (req, res) => updateLogged(req.body, res));

// Update a user's last logged in value
updateLogged = async (body, res) => {
  // update the user with id (in body.id) last time logged in
  const lastLogged = await updateLastLogged(body.id);

  // send a success response, with their last time logged in
  res.send({
    status: 'success',
    lastLogged
  });
};

// export the route and helper function
module.exports.routes = router;
module.exports.updateLastLogged = async id => updateLastLogged(id);
