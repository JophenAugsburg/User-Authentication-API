/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * This is the resolvers files usec for graphql mutations and queries.
 * This handles how the data is retreived from or entered into the database.
 */

// bringing in the account verification model
const { AccountVerification } = require('../../models/AccountVerification');

// get all of the account verification documents
const getAccountVerifications = () => AccountVerification.find();

// get a single account verififcation doc by its ID
const getAccountVerificationById = id => AccountVerification.findById(id);

// create an new account verification document.
/*
  - userID - the id of the user document this account verification is associated with
  - userFirstName - the first name of the user
  - userUsername - the username of the user
*/
const createAccountVerification = async (userId, userFirstName, userUsername) => {
  // get the current date
  const expirationDate = new Date();
  const fulfilled = false;
  // set the experation date to the current plus how many minutes allowed before it locks (specified in .env file)
  expirationDate.setMinutes(
    expirationDate.getMinutes() + process.env.ACCOUNT_VERIFCATION_DURATION
  );
  // create the new object / doc
  const accountVerification = new AccountVerification({
    fulfilled, userId, userFirstName, userUsername, expirationDate
  });
  // save the account verification doc to the databse
  await accountVerification.save();
  // return the account verification doc
  return accountVerification;
};

// updatte the fulfilled field in the account verfifcation document
// this takes in only the account verification document to be updated
const updateFulfilled = async (id) => {
  const val = await AccountVerification.findByIdAndUpdate(id,
    { $set: { fulfilled: true } },
    { new: true })
    .then(result => result);
  return val;
};

// Functions condenced to be exported
const AccountVerificationResolvers = {
  Query: {
    getAccountVerifications: () => getAccountVerifications(),
    getAccountVerificationById: ({ id }) => getAccountVerificationById(id)
  },
  Mutation: {
    createAccountVerification: async ({
      userId, userFirstName, userUsername
    }) => createAccountVerification(userId, userFirstName, userUsername),
    updateFulfilled: async ({
      id
    }) => updateFulfilled(id)
  }
};

module.exports.AccountVerificationResolvers = AccountVerificationResolvers;
