/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * Bring in the app_main file in every app folder.
 * This file is used go gather all of the app_main files to be used in
 * initalizing all of their routes (among other things if needed).
 */

const AccountHelpers = require('../Account-Helpers/app_main');
const User = require('../User/app_main');

module.exports.apps = [
  AccountHelpers,
  User
];
