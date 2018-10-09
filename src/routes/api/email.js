// works using my email
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
