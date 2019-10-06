/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This file is reponsible for updating the logs element in the User model (other model types with logs if any)
 */

// bring in the log messages (pre-set JSON list), as well as any models with logs
const { getLogMessage } = require('./logMessages');
const { User } = require('../../../apps/User/user.exports');

// declare functions
let updateLogs;
let updateUser;

// export the function to update logs
module.exports.updateLogs = async (
  id, type, messageNumber, logValue
) => updateLogs(id, type, messageNumber, logValue);

// handles routing to different functions
updateLogs = (id, type, messageNumber, logValue) => {
  // if the log message IS NOT as custom message, will not set the 'logVal'
  // if it is a custom message, will set the logVal to the passed in custom message
  let logVal = '';
  if (logValue !== undefined) {
    logVal = logValue;
  }
  // in this case only route to the user model function
  return updateUser(id, type, messageNumber, logVal);
};

// update the User model
/*
id : the id of the document
type : the type (i.e number in the JSON list) of log message
messageNumber : the number of which log message to use
logVal : the custom message if any (could be '')
*/
updateUser = async (id, type, messageNumber, logValue) => {
  // ge the current date/time
  const newDate = new Date();
  const date = newDate.toLocaleDateString('en-US', {
    // create new variable with the date and time in readable format
    // EX: September 25, 2019 12:30:40 PM
    year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
  });
  // set up the new entry. With the date in Date*() format, and the log message
  // the log messagte contains the formatted date as well as the message
  const val = {
    time: newDate,
    message: `${date} | ${getLogMessage[type.toLowerCase()][messageNumber]}${logValue}`
  };
  // mongoose request find by id and update their logs (array) element with the new log message
  const result = await User.findByIdAndUpdate(id,
    { $push: { logs: { $each: [val], $sort: -1 } } },
    { new: true })
    .then(r => r);
  // return the logs
  return result;
};
