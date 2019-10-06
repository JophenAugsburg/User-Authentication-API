/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This exports a middleware function used in every route.
 * It checks the API key(s) that are passed into the requests.
 */


module.exports.checkKey = async (req, res, next) => {
  // check the key
  // if the key does not match the API key, route them back
  // send them an 'invalid key' message.
  if (req.body.key !== process.env.API_KEY) {
    res.send('invalid key');
    return false;
  }
  // otherwise, pass them on, back to the route
  next();
};
