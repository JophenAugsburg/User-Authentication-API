/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is the routes file for dealing with account verifications.
 * It handles all of the account verification requests.
 *  - get account verification
 *  - send account verififed post - email url clicked
 *  - send account verification email
 */

// libraries
const express = require('express');
const { graphql } = require('graphql');
// helper functions
const {
  checkKey, checkQuery, updateLogs, verifyEmail, nodemailer
} = require('../../tools');
// typedefs and resolvers for the account verification
const { AccountVerificationResolvers } = require('../controllers/resolvers/AccountVerification.resolvers');
const { AccountVerificationTypedefs } = require('../controllers/typeDefs/AccountVerification.typedefs');
// typedefs and resolvers for the user model
const { userResolvers, userTypedefs } = require('../../User/user.exports');

const router = express.Router();

// declaring the route functions
let getAccountVerification;
let accountVerified;
let sendAccountVerification;

// declaring the routes
router.get('/account-verification', checkKey, async (req, res) => getAccountVerification(req.body, res));
router.post('/account-verification', checkKey, async (req, res) => accountVerified(req.body, res));
router.post('/send-account-verification', checkKey, async (req, res) => sendAccountVerification(req.body, res));

// Get an account verification by its id -> basic getter
getAccountVerification = async (body, res) => {
  // graphql request for find by id and get  the requested values in body
  const result = await graphql(AccountVerificationTypedefs,
    `{ getAccountVerificationById(id: "${body.id}") { ${body.values} } }`,
    AccountVerificationResolvers.Query).then(response => response.data);

  // check to make sure the graphql response is not null / undefined
  if (checkQuery(result, res)) {
    return;
  }
  // send back the graphql response
  res.send(result.getAccountVerificationById);
};

// Update an user document to reflect their account is verified
let updateUser;
accountVerified = async (body, res) => {
  // pull out the parameters from the body
  const {
    verificationId, id
  } = body;

  // update the database (user and account documents) to reflect the verfied account
  updateUser(verificationId, id);

  // send back a successful account verfied response
  res.send({
    status: 'success'
  });
};

// send an account verification email
let sendEmail;
sendAccountVerification = async (body, res) => {
  // pull out the parameters
  const {
    id, username, email, firstName
  } = body;

  // send the email using the user  id, username, email and first name
  await sendEmail(res, id, username, email, firstName);

  // send a successful response
  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

// update the useer and account verification documents
updateUser = async (verificationId, id) => {
  // Update User doc using their id.
  // updaate their accountVerified element to true
  await graphql(userTypedefs,
    `mutation{ updateUser(id: "${id}", updateVariable: "accountVerified", updateValue: "true") {id} }`,
    userResolvers.Mutation).then(response => response.data.updateUser);

  // Update Account Verification doc
  // pass in the account verification doc id and run the updateVerified function
  await graphql(AccountVerificationTypedefs,
    `mutation{ updateFulfilled(id: "${verificationId}") {id} }`,
    AccountVerificationResolvers.Mutation).then(response => response.data.updateFulfilled);

  // update the user document logs with a successful account verified log message
  updateLogs('User', id, 'authentication', 5);
};

// update the database with the new account verification doc and send them the email
sendEmail = async (res, id, username, email, firstName) => {
  // Create Account Verification document - used in verifying account
  const verificationId = await graphql(AccountVerificationTypedefs,
    `mutation{ createAccountVerification(model: "User", userId: "${id}", userFirstName: "${firstName}", userUsername: "${username}") {id} }`,
    AccountVerificationResolvers.Mutation)
    .then(response => response.data.createAccountVerification);

  // create the mail options used in nodemailer for sending the email
  const mailOptions = {
    from: `${process.env.NODEMAILER_NOREPLY_SENDER_USER}`,
    to: `${email}`,
    subject: `${process.env.LEAD_COMPANY_NAME} Email Verification | ${username}`,
    text: 'Message Sent!',
    // html is the verified email template broguht in above
    html: verifyEmail(
      process.env.LEAD_COMPANY_NAME,
      firstName,
      `${process.env.API_URL}/verify-account/${verificationId.id}`
    )
  };
  // send the email jusing the nodemailer function also brought in above
  nodemailer(res, mailOptions);
};
