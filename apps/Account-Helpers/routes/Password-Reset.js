/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * This is the routes file for dealing with password resets.
 * It handles all of the password reset requests.
 *  - get password reset
 *  - send account verififed post - email url clicked
 *  - send password reset email
 */

// libraries
const bcrypt = require('bcrypt');
const express = require('express');
const { graphql } = require('graphql');
// helper functions - notable updateLogs, nodemailer (for emailing), and passwordResetEmail (html template)
const {
  checkKey, checkQuery, updateLogs, nodemailer, passwordResetEmail
} = require('../../tools');
// the password reset GraphQL resolvers and typedefs
const { PasswordResetResolvers } = require('../controllers/resolvers/PasswordReset.resolvers');
const { PasswordResetTypedefs } = require('../controllers/typeDefs/PasswordReset.typedefs');
// the user graphQL resolvers and typedefs
const { userResolvers, userTypedefs } = require('../../User/user.exports');

const router = express.Router();

// declare the functions used in routes
let getPasswordReset;
let sendPasswordReset;
let resetPassword;

// decalre the routes
router.get('/password-reset', checkKey, async (req, res) => getPasswordReset(req.body, res));
router.post('/send-password-reset', checkKey, async (req, res) => sendPasswordReset(req.body, res));
router.post('/password-reset', checkKey, async (req, res) => resetPassword(req.body, res));

// Get a password reset by its id
getPasswordReset = async (body, res) => {
  // graphQL query to find a password reset by its id. Return the values specified in body.values
  const result = await graphql(PasswordResetTypedefs,
    `{ getPasswordResetById(id: "${body.id}") { ${body.values} } }`,
    PasswordResetResolvers.Query).then(response => response.data);

  // check to make sure the query's repsonse was good (not null or undefined)
  if (checkQuery(result, res)) {
    return;
  }
  // if good, send back the result
  res.send(result.getPasswordResetById);
};

// post request to send a password reset email. To send the email to them.
let sendPasswordResetEmail;
sendPasswordReset = async (body, res) => {
  // pull out the parameters
  const {
    email
  } = body;

  // GraphQL query for a user by their email
  const result = await graphql(userTypedefs,
    `{ getUserByEmail(email: "${email}") {id locked firstName username} }`,
    userResolvers.Query).then(response => response);

  // make sure the query is good / the email was found
  if (
    result.data.getUserByEmail === null
  ) {
    res.send({
      status: 'failure',
      reason: 'bad email'
    });
    return;
  }

  // update the database and send the password reset email
  await sendPasswordResetEmail(
    res,
    result.data.getUserByEmail.id,
    result.data.getUserByEmail.username,
    result.data.getUserByEmail.firstName,
    email
  );

  // send a 'success' response
  res.send({
    status: 'success'
  });
};

// they have send a reset password post request
let checkSecurityQuestions;
let updateUser;
resetPassword = async (body, res) => {
  // pull out the required parameters
  const {
    id, userId, newPassword,
    questionOne, questionOneAnswer,
    questionTwo, questionTwoAnswer
  } = body;

  // Get the user by their id
  const questions = await graphql(userTypedefs,
    `{ getUserById(id: "${userId}") {securityQuestions} }`,
    userResolvers.Query).then(response => response.data.getUserById);

  // Check that their security questsion match waht was set in their account
  // if not, send a 'security questions incorrect' failure reponse
  if (
    !(await checkSecurityQuestions(
      questionOne,
      questionTwo,
      questions.securityQuestions,
      questionOneAnswer,
      questionTwoAnswer
    ))
  ) {
    res.send({
      status: 'failure',
      reason: 'security questions incorrect'
    });
    return;
  }

  // otherwise, the password reset is successfuly, so update their password
  await updateUser(
    id,
    userId,
    newPassword
  );

  // send them 'success' reponse
  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

// This function handles sending the email to the user
sendPasswordResetEmail = async (res, id, username, firstName, email) => {
  // Create password reset document - used for documenting the password reset
  // it required the user's id, firstName and username
  // return the id of the password reset, which is used in the URL of the password reset url
  const passwordResetId = await graphql(PasswordResetTypedefs,
    `mutation{ createPasswordReset(userId: "${id}", userFirstName: "${firstName}", userUsername: "${username}") {id} }`,
    PasswordResetResolvers.Mutation).then(response => response.data.createPasswordReset);

  // create the mail options for sending the email
  const mailOptions = {
    from: `${process.env.NODEMAILER_NOREPLY_SENDER_USER}`,
    to: `${email}`,
    subject: `${process.env.COMPANY_NAME} Password Reset | ${username}`,
    text: 'Message Sent!',
    // use the password reset email html template
    html: passwordResetEmail(
      process.env.COMPANY_NAME,
      firstName,
      `${process.env.API_URL}/password-reset/${passwordResetId.id}`
    )
  };
  // send the email using those options
  nodemailer(res, mailOptions);
};

// helper function to check the user's security questions
// check if they match up / are correct
checkSecurityQuestions = async (
  questionOne,
  questionTwo,
  securityQuestions,
  answerOne,
  answerTwo
) => {
  // a bunch of if-statements to check if the security questions match
  // essentially finding which security 'questions' match the one's being sent in
  // ex: if the question was 'your first name', find the security question (1 2 or 3) that holds that
  let questionOneAnswer;
  let questionTwoAnswer;
  if ((`${questionOne}?`) === securityQuestions.questionOne.question) {
    questionOneAnswer = securityQuestions.questionOne.answer;
  }
  if ((`${questionOne}?`) === securityQuestions.questionTwo.question) {
    questionOneAnswer = securityQuestions.questionTwo.answer;
  }
  if ((`${questionOne}?`) === securityQuestions.questionThree.question) {
    questionOneAnswer = securityQuestions.questionThree.answer;
  }
  if ((`${questionTwo}?`) === securityQuestions.questionOne.question) {
    questionTwoAnswer = securityQuestions.questionOne.answer;
  }
  if ((`${questionTwo}?`) === securityQuestions.questionTwo.question) {
    questionTwoAnswer = securityQuestions.questionTwo.answer;
  }
  if ((`${questionTwo}?`) === securityQuestions.questionThree.question) {
    questionTwoAnswer = securityQuestions.questionThree.answer;
  }
  // check if the security question answers match what is saved
  // if they do, return true
  if (
    questionOneAnswer.toUpperCase() === answerOne.toUpperCase()
    && questionTwoAnswer.toUpperCase() === answerTwo.toUpperCase()
  ) {
    return true;
  }
  // if the security questsions are not correct, return false
  return false;
};

// thye have successfully passed the security question check, so reset their password
updateUser = async (passwordResetId, id, password) => {
  // hash the new password using bcrypt
  const newPassword = await bcrypt
    .hash(password, 10)
    .then(hash => hash);

  // graphQL mutation to update the user
  // update password element with 'newPassword'
  const userResult = await graphql(userTypedefs,
    `mutation{ updateUser(id: "${id}", updateVariable: "password", updateValue: "${newPassword}") {id locked} }`,
    userResolvers.Mutation).then(response => response.data.updateUser);

  // Check for the account being locked, and if so, unlock it
  if (userResult.locked) {
    await graphql(userTypedefs,
      `mutation{ updateUser(id: "${id}", updateVariable: "locked", updateValue: "false") {id} }`,
      userResolvers.Mutation).then(response => response.data.updateUser);
    // update the user logs to say they have unlocked their account
    updateLogs('User', id, 'authentication', 7);
  }

  // Update Password Reset doc to say it was fulfilled - used in resetting a password
  // just set the fulfilled value to true
  await graphql(PasswordResetTypedefs,
    `mutation{ updateFulfilled(id: "${passwordResetId}") {id} }`,
    PasswordResetResolvers.Mutation).then(response => response.data.updateFulfilled);

  // update the user logs to say theu have reset their password
  updateLogs('User', id, 'authentication', 6);
};
