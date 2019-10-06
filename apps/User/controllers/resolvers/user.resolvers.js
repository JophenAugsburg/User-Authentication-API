/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This contains the resolver functions - buildschema for graphql queries / mutations
 *
 * This essentially are the funftions that actually pull data from and update the database
 */

// library and the user model
const bcrypt = require('bcrypt');
const { User } = require('../../models/User');

// get all of the users
const getUsers = () => User.find();

// get a single user by their ID
const getUserById = id => User.findById(id);

// get a single user by their username
const getUserByUsername = username => User.findOne({ username: new RegExp(`^${username}$`, 'i') });

// get a single user by their email
const getUserByEmail = email => User.findOne({ email: new RegExp(`^${email}$`, 'i') });

// create a new user with the following parameters
const createUser = async (
  firstName, lastName, email, username, password,
  securityQuestionOne, securityQuestionOneAnswer,
  securityQuestionTwo, securityQuestionTwoAnswer,
  securityQuestionThree, securityQuestionThreeAnswer
) => {
  // Hash the passward passed in
  const hashedPassword = await bcrypt
    .hash(password, 10)
    .then(hash => hash);
  // get the current date
  const date = new Date();
  // create the user object - document
  const user = new User({
    locked: false,
    disabled: false,
    accountVerified: false,
    email,
    username,
    firstName,
    lastName,
    password: hashedPassword,
    dateCreated: date,
    dateModified: date,
    securityQuestions: {
      questionOne: {
        question: securityQuestionOne,
        answer: securityQuestionOneAnswer,
      },
      questionTwo: {
        question: securityQuestionTwo,
        answer: securityQuestionTwoAnswer,
      },
      questionThree: {
        question: securityQuestionThree,
        answer: securityQuestionThreeAnswer,
      },
    },
  });
  // save the new user to the database
  await user.save();
  // return the new - crated user
  return user;
};

// delete a user by their ID and return them
const deleteUser = async id => User.findByIdAndDelete(id).then(result => result);

// update a specific value in a user document
const updateUser = async (id, updateVariable, updateValue) => {
  // if the updateValue is noted as a date, get the current date and update the
  // specified date type element
  if (updateValue === '~DATETIME~') {
    const val = await User.findByIdAndUpdate(id,
      { $set: { [updateVariable]: new Date() } },
      { new: false })
      .then(result => result);
    return val;
  }
  // otherwise update an element normally
  // updateVariable = the doc element to be updated
  // updateValue = the new value
  const val = await User.findByIdAndUpdate(id,
    { $set: { [updateVariable]: updateValue } },
    { new: true })
    .then(result => result);
  // return the updated document
  return val;
};

// Functions condenced to be exported
// GraphQL Style
// Query =  function to deal with retreiving data
// Mutation = function to deal with updating / changing data
const userResolvers = {
  Query: {
    getUsers: () => getUsers(),
    getUserById: ({ id }) => getUserById(id),
    getUserByUsername: ({ username }) => getUserByUsername(username),
    getUserByEmail: ({ email }) => getUserByEmail(email)
  },
  Mutation: {
    createUser: async ({
      firstName, lastName, email, username, password,
      securityQuestionOne, securityQuestionOneAnswer,
      securityQuestionTwo, securityQuestionTwoAnswer,
      securityQuestionThree, securityQuestionThreeAnswer
    }) => createUser(
      firstName, lastName, email, username, password,
      securityQuestionOne, securityQuestionOneAnswer,
      securityQuestionTwo, securityQuestionTwoAnswer,
      securityQuestionThree, securityQuestionThreeAnswer
    ),
    deleteUser: async ({ id }) => deleteUser(id),
    updateUser: async ({
      id, updateVariable, updateValue
    }) => updateUser(id, updateVariable, updateValue),
  }
};

module.exports.userResolvers = userResolvers;
