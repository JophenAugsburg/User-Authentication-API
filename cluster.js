/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This is responsible for starting up the server in cluster mode.
 * Servers will be started on each core, enabling the app to handle more traffic.
 */

// libraries
const chalk = require('chalk');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;

// Code to run if we're in the master process
if (cluster.isMaster) {
  // Create a worker for each CPU
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  // eslint-disable-next-line global-require
  require('./server');
  console.log(`Started server on => ${chalk.blue(`http://localhost:${process.env.PORT}`)} for Process Id ${chalk.green(process.pid)}`);
}
