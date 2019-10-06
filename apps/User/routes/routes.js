/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is the overall router file for this app
 * Brings in all of hhe routes in the other files
 *
 * This router is exported, and used in the app_main file
 */

// libraries
const express = require('express');

// Bring in routes from other files in /routes/
const GetUser = require('./Get-User');
const CreateUser = require('./Create-User');
const UpdateUser = require('./Update-User');
const DeleteUser = require('./Delete-User');
const UserSignIn = require('./User-Sign-In');

const router = express.Router();

// Add routes to the router
router.use('/', GetUser.routes);
router.use('/', CreateUser.routes);
router.use('/', UpdateUser.routes);
router.use('/', DeleteUser.routes);
router.use('/', UserSignIn.routes);

module.exports.routes = router;
