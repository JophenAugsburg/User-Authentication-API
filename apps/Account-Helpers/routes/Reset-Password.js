/**
 * Author
 * Joseph Hentges
 * November 2019
 * https://joeyhentges.com
 *
 *
 * This is the route for resetting user passwords.
 * Make a request to here for resetting any user password.
 */

// libraries and helper functions
const express = require('express');
const bcrypt = require('bcrypt');
const { graphql } = require('graphql');
require('dotenv').config();
const { checkKey, updateLogs } = require('../../tools');
const { User, userResolvers, userTypedefs } = require('../../User/user.exports');

const router = express.Router();

// declare route function
let resetPasswordFromPRK;
let resetPasswordFromUser;

// declare route
router.post('/prk-reset-password', checkKey, async (req, res) => resetPasswordFromPRK(req.body, res));
router.post('/user-reset-password', checkKey, async (req, res) => resetPasswordFromUser(req.body, res));

// declare overall functions
let setNewPassword;

// change a user password from a password reset key - this does not require their old password
// generates a random new passwsord.
let generateNewPassword;
resetPasswordFromPRK = async (body, res) => {
  // get the parameters from request body
  const {
    passwordResetKey, userId
  } = body;
  
  // check the passwordResetKeyMatcbes
  if (passwordResetKey !== process.env.PASSWORD_RESET_KEY) {
    res.send({
      status: 'failure',
      message: 'Failed to submit the correct password reset key',
    });
    return;
  }

  // generate a new random password
  const newPassword = generateNewPassword();

  // update the user with their new password
  const account = await setNewPassword(userId, newPassword);

  // send a success response, with their new password
  res.send({
    status: 'success',
    message: 'Successfully set new password.',
    userId,
    newPassword
  });
};

// reset the password from the user - use their current password as certification
let getUserPassword;
resetPasswordFromUser = async (body, res) => {
  // get the parameters from request body
  const {
    userId, currentPassword, newPassword
  } = body;

  // get the user values
  const { password } = await getUserPassword(userId);

  // check current user password and passed in password are the same
  if (!(await bcrypt.compare(currentPassword, password))) {
    res.send({
      status: 'failure',
      message: 'Failed to submit the correct current password.',
    });
    return;
  }

  // update the user with their new password
  const account = await setNewPassword(userId, newPassword);

  // send a success response, with their new password
  res.send({
    status: 'success',
    message: 'Successfully set new password.',
    newPassword
  });
};

// export the route and helper function
module.exports.routes = router;

// generate a new password with a random string
generateNewPassword = () => {
  return Math.random().toString(36).substring(2, 15);
}

// set the user's password with the new password
setNewPassword = async (userId, newPassword) => {
  // hash the new password using bcrypt
  const hashedNewPassword = await bcrypt.hash(newPassword, 10).then(hash => hash);

  // update the password in the user document
  // return the user document
  return await User.findByIdAndUpdate(userId,
    { $set: { password: hashedNewPassword } },
    { new: true })
    .then(result => result);
}

// get the user by their userId
getUserPassword = async (userId) => {
  return await graphql(userTypedefs,
    `{ getUserById(id: "${userId}") { password } }`,
    userResolvers.Query).then(response => response.data.getUserById);
}