const Mailjet = require('node-mailjet');

const sendConfirmationEmail = async (email, token) => {
  if (!email || !token) {
    throw new Error('The email and the token are required');
  }

  const CONFIRM_URL = `${process.env.CONFIRM_USER_LINK_URL}/${token}`;

  const mailjetConnection = Mailjet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
  console.log('Sending Email');
  return mailjetConnection.post('send', {version: 'v3.1'}).request({
    Messages: [
      {
        From: {
          Email: process.env.CONFIRM_USER_FROM_EMAIL,
          Name: process.env.CONFIRM_USER_FROM_NAME,
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: process.env.CONFIRM_USER_EMAIL_SUBJECT,
        TextPart: `
        Hi, navigate to the next link to confirm your account: ${CONFIRM_URL}
        \n
        Regards.
        `,
        HTMLPart: `
        Hi,
        <br>
        <br>
        Click on the next link to confirm your account: <a href="${CONFIRM_URL}">${CONFIRM_URL}</a>
        <br>
        Regards.
        `,
        CustomID: process.env.CONFIRM_USER_CUSTOM_ID || 'ConfirmAccount',
      },
    ],
  });
};

module.exports = sendConfirmationEmail;
