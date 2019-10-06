/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * Exporting the Admin model, resolvers and typedefs.
 * This is for use outside this app. Makes it eaiser to grab the needed items
 */

const { User } = require('./models/User');
const { userResolvers } = require('./controllers/resolvers/user.resolvers');
const { userTypedefs } = require('./controllers/typeDefs/user.typedefs');

// contents to be exported
const contents = {
  User,
  userResolvers,
  userTypedefs,
};

// exporting the contents
module.exports = contents;
