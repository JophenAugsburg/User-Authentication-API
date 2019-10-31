/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * This is the overall router for this app. Bring in the routes from all of the other files
 * and add it to this router, to be included in the overall routing.
 */

const express = require('express');

// Bring in routes
const UpdateLastLoggedIn = require('./Update-Last-Logged-In');
const UpdateLogs = require('./Update-Logs');
const LockAccount = require('./Lock-Account');
const ResetPassword = require('./Reset-Password');

const router = express.Router();

// Add routes to the router
router.use('/', UpdateLastLoggedIn.routes);
router.use('/', UpdateLogs.routes);
router.use('/', LockAccount.routes);
router.use('/', ResetPassword.routes);

module.exports.routes = router;
