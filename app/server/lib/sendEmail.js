const postmark = require('postmark');
const ejs = require('ejs');
const config = require('config/config.js');

const emailClient = postmark(config.postmark.serverKey);

module.exports = function sendEmail ({ to, subject, templateName, context = {} }) {
  return new Promise( (resolve, reject) => {

    if (config.postmark.validRecipient(to)) {

      const send = (textBody, htmlBody) => {

        emailClient.sendEmail({
          'From': config.postmark.from,
          'To': to,
          'Subject': subject, 
          'TextBody': textBody,
          'HtmlBody': htmlBody
        }, (err, result) => {
          if (err) {
            console.error('Unable to send via postmark: ' + err.message);
            reject(err);
          } else {
            console.info('Sent to postmark for delivery: ' + result);
            resolve(result);
          }
        });
      };

      ejs.renderFile(config.paths.base+ '/views/' + templateName + '-text.ejs', context, function (err, textBody) {
        if (err) {
          reject(err);
        } else {
          ejs.renderFile(config.paths.base+ '/views/' + templateName + '-html.ejs', context, function (err, htmlBody) {
            if (err) {
              reject(err);
            } else {
              send(textBody, htmlBody);
            }
          });
        }
      });
    } else {
      console.info(to + ' does not pass validRecipient test so not sending email');
      resolve();
    }
  });
}
