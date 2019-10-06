/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This file sets up the server requirements and brings in all
 * routes from the main folder.
 */

// libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Export app to be used in Server.js
module.exports.app = app;

// Add Routes from Main to the app.
app.use('/', require('./main/routes/routes').router);
