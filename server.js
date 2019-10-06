/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This file is responsible for starting the server.
 * Runs it locally, or in deployment, on a liver server.
 */

// libraries
const chalk = require('chalk');
const debug = require('debug')('app');
const { app } = require('./app');

const port = process.env.PORT;

// Start up the server!
const startServer = async () => {
  app.listen(port, () => {
    debug(`Started server on => ${chalk.blue(`http://localhost:${process.env.PORT}`)}`);
  });
};

startServer();
