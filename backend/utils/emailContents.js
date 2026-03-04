const emailTemplate = require("./emailTemplate");

const newUserEmail = ({ name, email, password }) => ({
  subject: "Welcome to LinkPanel \u2014 Your Account Details",
  html: emailTemplate({
    title: "Welcome to LinkPanel",
    body: `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your account has been created by an administrator. You can now log in to LinkPanel using the credentials below.</p>
      <div class="info-box">
        <div class="row">
          <span class="label">Email</span>
          <span class="value">${email}</span>
        </div>
        <div class="row">
          <span class="label">Password</span>
          <span class="value">${password}</span>
        </div>
      </div>
      <p>For security, please change your password after your first login.</p>
      <p>If you have any questions, contact your administrator.</p>
    `,
    footer: "&copy; LinkPanel. This is an automated message, please do not reply.",
  }),
  text: `Hi ${name},\n\nYour LinkPanel account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after login.`,
});

module.exports = { newUserEmail };
