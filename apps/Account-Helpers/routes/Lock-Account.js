/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * This is the route and function export file for account locking.
 * This checks th user account logs and determines if they need to be locked.
 */

// libraries
const express = require('express');
// bringing in the user model and helper functions
const { User } = require('../../User/user.exports');
const { checkKey, updateLogs } = require('../../tools');

const router = express.Router();

// declare the route function
let lockAccount;

// declare the route
router.post('/lock-account', checkKey, async (req, res) => lockAccount(req.body, res));

// function to go with the lock account route runction
let updateAccount;
lockAccount = async (body, res) => {
  // parameters
  const {
    id, logs, lock
  } = body;

  res.send({
    locked: updateAccount(id, logs, lock)
  });
};

// exporting the routes as well as the hlper lock account function
module.exports.routes = router;
module.exports.lockAccount = async (id, logs) => updateAccount(id, logs, true);

// function to deal with checking the account and lockking it
updateAccount = async (id, logs, lock) => {
  const limitDate = new Date();
  // based on the current date, subtract the user locked length
  // the user locked length is how much time they are given to attempt to log in
  // if set to 15, they can only try to log in 3 times within that 15 minutes
  // 3 bad login attempts and the account is locked - resulting in them needing to reset their password
  limitDate.setMinutes(limitDate.getMinutes() - process.env.USER_LOCKED_LENGTH);
  // if here, assume failed login is already 1
  let failedLogin = 1;
  let i = 0;
  if (logs.length > 0) {
    // while there are still logs to go through,
    // the log time you're on is not older than the limited date,
    // and there are under 3 failed login attempts
    while (i < logs.length && logs[i].time > limitDate && failedLogin < 3) {
      // if there is a successfuly login attempt before 3 fails and within those 15 minutes,
      //  break out and set logs with a failed login attempt
      if (
        logs[i].message.includes('Successfully logged in.')
        || logs[i].message.includes('Successfully reset password - reset password through "Forgot Password"')
      ) {
        break;
      }

      // if failed login attempt in logs, increment the failed login counter
      if (logs[i].message.includes('Failed to logged in.')) {
        failedLogin += 1;
      }

      // increment i (while log (index) in the array)
      i += 1;
    }

    // if there are 3 or more failed login attempts, lock their account and  update their logs
    // with a 'locked account' log.
    // return true - their account is locked
    if (failedLogin >= 3) {
      // update the doc
      await User.findByIdAndUpdate(id,
        { $set: { locked: lock } },
        { new: true })
        .then(r => r);
      await updateLogs('Admin', id, 'authentication', 8);
      return true;
    }
  }
  // return false - their account is not locked
  return false;
};
