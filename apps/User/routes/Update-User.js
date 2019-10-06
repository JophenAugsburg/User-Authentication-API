/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This handles the function of updating the user documents.
 *
 * It can handle updating single elements, and arrays
 * Also, it can deal with uploading images (currently convers it to base64 string)
 */

// libraries
const express = require('express');
const multer = require('multer');
const { checkKey } = require('../../tools');
const { User } = require('../models/User');

// set up the multer middleware
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// decalre the functions
let updateUser;

// declare the routes
router.post('/update', checkKey, upload.single('file'), async (req, res) => updateUser(req.body, req.file, res));

// update an User value
updateUser = async (body, file, res) => {
  // pull out all of the parameters
  const {
    id, variable
  } = body;
  let { value } = body;

  // check for an image
  // if there is one, set the value variable to that image in base64-string format
  if (value === 'image') {
    value = `data:image/jpeg;base64,${file.buffer.toString('base64')}`;
  }

  // check if the value is an array
  if (value === 'array') {
    // handle updating the array
    await handleArray(body);
  } else if (value === 'array-delete') {
    // handle updating an array by deletion
    await handleArrayDelete(body);
  } else {
    // otherwire, normal - update the User doc
    await User.findByIdAndUpdate(id,
      { $set: { [variable]: value } },
      { new: true })
      .then(result => result);
  }
  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

// handle an array element update
handleArray = async (body) => {
  // pull out the parameters
  const {
    id, array, arrayIdentifier, identifier
  } = body;
  const arrayValue = body;

  // run through the array passed in
  for (let i = 0; i < arrayValue.length; i += 1) {
    // construct the variable to be updated
    // array = the element array to be updated
    // arrayValue[i].varialbe = the variable in that array to be updated
    const newVariable = `${array}.$.${arrayValue[i].variable}`;
    // updatte the array
    // arrayIdentifier = how to identify the correct object in the array to update
    // identifer = the value identified
    // arrayValue[i].value = the new value
    User.update(
      { _id: id, [`${array}.${arrayIdentifier}`]: identifier },
      { $set: { [newVariable]: arrayValue[i].value } },
      { new: true }
    ).then(result => result);
  }
};

// handle an array deletion
handleArrayDelete = async (body) => {
  // pull out parameters
  const {
    id, array, arrayIdentifier, identifier
  } = body;

  // find by id and an arrayIdentifier
  // identifder = the element identifed as the one to be removed
  await User.findByIdAndUpdate(id,
    { $pull: { [array]: { [arrayIdentifier]: identifier } } }, { safe: true });
};
