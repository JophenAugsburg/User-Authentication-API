/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This exports a function that handles emailing.
 * Will send emails to people based on the mailoptions.
 */

// bring in nodemailer library
const nodemailer = require('nodemailer');

// expprt the function
/*
mailoptions: contains what will be sent, and where
*/
module.exports = (
  res, mailOptions
) => {
  // create the nodemailer transporter object
  const transporter = nodemailer.createTransport({
    // what service you are using - i.e Gnail
    service: `${process.env.NODEMAILER_NOREPLY_SENDER_SERVICE}`,
    // the username (email) and password of the email account sending the email
    auth: {
      user: `${process.env.NODEMAILER_NOREPLY_SENDER_USER}`,
      pass: `${process.env.NODEMAILER_NOREPLY_SENDER_PASSWORD}`
    }
  });
  // send the email and log the error if any
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    }
  });
  // end the nodemailer response
  res.end();
};
