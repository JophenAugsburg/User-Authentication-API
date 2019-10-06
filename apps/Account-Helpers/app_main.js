/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This file is the app_main file for this folder.
 * It exports the routes to be added to the /apps/ folder router (app≥.js)
 *
 * Most notably, this sets the url path that every route in this folder is under.
 * It will prefix any url under this folder.
 * Ex:
 *  /helpers/xxx
 */

// bring in the routes file, which in itself brings in all of the routes in the folder
const { routes } = require('./routes/routes');

// the url variable is the path prefixing each item in this folder's url
const contents = {
  url: '/helpers',
  routes,
};

module.exports = contents;
