/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This exports a function that handles checking GraphQL reponses.
 * Will return if the query, was bad / couldn't find what the request wanted.
 */

module.exports.checkQuery = (result, res) => {
  // check the the repsonse was null or undefined
  // if it is, send them 'invalid query' and return true
  if (result === null || result === undefined) {
    res.send('invalid query');
    return true;
  }
  return false;
};
