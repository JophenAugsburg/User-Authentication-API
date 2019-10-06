/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * The routes files are responsible for handling url, form, or any other type of request.
 *
 * This is the Routes file, which handles bringing in all of the routes from different files
 * and experting them (which is used in the apps file)
 *
 * In this case most significantly it brings int he /apps/_/apps/ file which contains all
 * of the routes in the /apps/ folder
 */

// libraries
const express = require('express');

const router = express.Router();

// Routes from other files Bringing in routes from 'apps'.
router.use('/', require('../../apps/_/apps').router);

module.exports.router = router;
