/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 *
 * This is the routes and helper function file for updating the accounts logs
 * If they was to do this via the api, send the post request to '/update-logs'
 *
 * May never be used, but the option is there
 */

// libraries and helper functions
const express = require('express');
const { checkKey, updateLogs } = require('../../tools');

const router = express.Router();

// declare route function
let addLogs;

// declare route
router.post('/update-logs', checkKey, async (req, res) => addLogs(req.body, res));

// Update the logs for a Company, Admin or User
addLogs = async (body, res) => {
  // update the logs
  // this requires:
  /*
   - the user id
   - the message type (EX: 'Authentication')
   - the message number
   - the log values - a string if a custom value to add on if the log message is custom
  */
  await updateLogs(
    body.id, body.type, body.messageNumber, body.logValue
  );

  // send a success response
  res.send({
    status: 'success'
  });
};

// export the route and helper function
module.exports.routes = router;
module.exports.updateLogs = async (
  id, type, messageNumber, logValue
) => updateLogs(id, type, messageNumber, logValue);
