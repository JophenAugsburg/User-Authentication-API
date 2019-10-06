/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This acts as the 'routes' file for the /apps/ folder. /main/routes/ picks up the
 * router this file exports and is able to include all of the routes in the /apps/ folder.
 */

const express = require('express');

const router = express.Router();

router.use('/', require('./initialize_apps').router);

module.exports.router = router;
