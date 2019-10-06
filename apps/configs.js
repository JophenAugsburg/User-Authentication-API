/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * Bring in any configuration files, such as databases.
 * Separate from tools, in the 'tools.js' file.
 */

const { dbs } = require('../main/configs/db/db_connection');

module.exports = {
  dbs,
};
