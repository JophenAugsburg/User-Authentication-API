/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * This is the resolvers files used for graphql mutations and queries.
 * This handles how the data is retreived from or entered into the database.
 */

// bringing in the password reset model
const { PasswordReset } = require('../../models/PasswordReset');

// get all of the password reset documents
const getPasswordResets = () => PasswordReset.find();

// get a single password reset document by its ID
const getPasswordResetById = id => PasswordReset.findById(id);

// create a new password reset document.
// Takes in:
/*
  - userID - the user ID this password reset is associated with
  - userFirstName - the first name of the user
  - userUsername - the username of the user
*/
const createPasswordReset = async (userId, userFirstName, userUsername) => {
  // get the current date
  const expirationDate = new Date();
  const fulfilled = false;
  // set the experation date to the current plus how many minutes allowed before it locks (specified in .env file)
  expirationDate.setMinutes(
    expirationDate.getMinutes() + process.env.PASSWORD_RESET_DURATION
  );
  // create the object / doc
  const passwordReset = new PasswordReset({
    fulfilled, userId, userFirstName, userUsername, expirationDate
  });
  // save the new password reset doc to the database
  await passwordReset.save();
  // return the new / created password reset doc
  return passwordReset;
};

// update the fulfilled value in the doc. Takes in only the password reset id to be updated
const updateFulfilled = async (id) => {
  const val = await PasswordReset.findByIdAndUpdate(id,
    { $set: { fulfilled: true } },
    { new: true })
    .then(result => result);
  return val;
};

// Functions condenced to be exported
const PasswordResetResolvers = {
  Query: {
    getPasswordResets: () => getPasswordResets(),
    getPasswordResetById: ({ id }) => getPasswordResetById(id)
  },
  Mutation: {
    createPasswordReset: async ({
      userId, userFirstName, userUsername
    }) => createPasswordReset(userId, userFirstName, userUsername),
    updateFulfilled: async ({
      id
    }) => updateFulfilled(id)
  }
};

module.exports.PasswordResetResolvers = PasswordResetResolvers;
