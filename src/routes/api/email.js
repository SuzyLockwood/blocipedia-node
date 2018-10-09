// works using my email
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  'SG.gF1111GtRwu8_TG5r91azg.GHwAk8GoEywp1kFZ_GhPDrqInsnySnMDZq5Rk7AkF-8'
);

module.exports = {
  sendEmail(newUserEmail) {
    const msg = {
      to: newUserEmail,
      from: 'test@no-reply.com',
      subject: 'Blocipedia Account',
      html:
        '<p style="font-size: 32px;">Thank you for signing up for Blocipedia! This email confirms your account was successfully created.</p>'
    };
    sgMail.send(msg);
  }
};
// module.exports = sendEmail;

/*  Old code
const async = require('async');
var helper = require('@sendgrid/mail');

function sendEmail(
  parentCallback,
  fromEmail,
  toEmails,
  subject,
  textContent,
  htmlContent
) {
  const errorEmails = [];
  const successfulEmails = [];
  const sg = require('sendgrid')(
    'SG.gF1111GtRwu8_TG5r91azg.GHwAk8GoEywp1kFZ_GhPDrqInsnySnMDZq5Rk7AkF-8'
  );
  async.parallel(
    [
      function(callback) {
        // Add to emails
        for (let i = 0; i < toEmails.length; i += 1) {
          // Add from emails
          const senderEmail = new helper.Email(fromEmail);
          // Add to email
          const toEmail = new helper.Email(toEmails[i]);
          // HTML Content
          const content = new helper.Content('text/html', htmlContent);
          const mail = new helper.Mail(senderEmail, subject, toEmail, content);
          var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
          });
          sg.API(request, function(error, response) {
            console.log('SendGrid');
            if (error) {
              console.log('Error response received');
            }
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
          });
        }
        // return
        callback(null, true);
      }
    ],
    function(err, results) {
      console.log('Done');
    }
  );
  parentCallback(null, {
    successfulEmails: successfulEmails,
    errorEmails: errorEmails
  });
}

module.exports = app => {
  app.post('/api/send', function(req, res, next) {
    async.parallel(
      [
        function(callback) {
          sendEmail(
            callback,
            'susan.m.mullin@gmail.com',
            ['susan.m.mullin@gmail.com'],
            'Subject Line',
            'Text Content',
            '<p style="font-size: 32px;">HTML Content</p>'
          );
        }
      ],
      function(err, results) {
        res.send({
          success: true,
          message:
            'Thank you for signing up for Blocipedia! This email confirms your account was successfully created.',
          successfulEmails: results[0].successfulEmails,
          errorEmails: results[0].errorEmails
        });
      }
    );
  });
};

*/
