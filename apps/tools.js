/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * Bring in any tools and templates thar are used across different apps in the apps folder
 * Middleware and helper functions placed here
 */

// tools and helpers
const { checkKey } = require('../main/controllers/api-tools/check-key');
const { checkQuery } = require('../main/controllers/api-tools/check-query');
const { updateLogs } = require('../main/controllers/tools/update.logs');
const { updateLastLogged } = require('../main/controllers/tools/update.LastLoggedIn');

// expoprt so be used accross the apps folder
module.exports = {
  checkKey,
  checkQuery,
  updateLogs,
  updateLastLogged,
};
