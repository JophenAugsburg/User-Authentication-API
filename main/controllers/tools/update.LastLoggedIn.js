/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This function handles updaging the usner's last time logged in.
 * Used in the /apps/user/routes/User-Sign-In.js route
 */

// bring in the User model from the exported items in the '/apps/User/ folder
const { User } = require('../../../apps/User/user.exports');

// initialize the updateUser function
let updateUser;

// export the function to update their last time signed in
// takes the user's id and model. The model is being taking in if there happens to be
// multiple types of users, ex: User, Admin...
module.exports.updateLastLogged = async (model, id) => updateUser(id);

// update a User model
// takes in the User model's id.
updateUser = async (id) => {
  // get the current date/time
  const newDate = new Date();
  // run a mongoose request to updare by id
  // set their dateLastLoggedIn to the new date
  // return their last time logged in
  const lastLogged = await User.findByIdAndUpdate(id,
    { $set: { dateLastLoggedIn: newDate } },
    { new: false })
    .then(result => result);

  // if lastLogged is null / never set / never logged in before
  // return the current date/time
  if (lastLogged === null) {
    return newDate;
  }
  // otherwise return the last date/time they logged in
  return lastLogged.dateLastLoggedIn;
};
