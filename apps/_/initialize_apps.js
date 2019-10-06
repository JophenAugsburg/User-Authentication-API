/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This file is reponsible initalizing all of the items in the app_main files.
 * At this time, the only thing initalized / done is add their routes to the overall app.
 *
 * This grabs the routes exported by the app_main file in each folder and adds them to the
 * router. That router is then passed to app.js.
 */

// libraries and bring in the app list.
const express = require('express');
const { apps } = require('./app.list');

const router = express.Router();

// run through each app in the app list and add their routes to the router
for (let i = 0; i < apps.length; i += 1) {
  router.use(apps[i].url, apps[i].routes);
}

// export the router
module.exports.router = router;
