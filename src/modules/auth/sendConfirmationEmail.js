const mailjet = require('../../config/mailjet');
const {VALID_TYPE_USERS, USER} = require('../../config/config');

/**
 * @name sendConfirmationEmail
 * @function
 * @async
 * @memberof module:Auth
 * @description Sends an email to a user to activate their account
 * @param {string} email User's email
 * @param {string} type User's type
 * @param {string} id User's id
 * @param {string} token User's token
 * @param {number} [SKIP_CONFIRMATION_EMAIL=0] If 1, the email is not sent
 */
const sendConfirmationEmail = async (email, type, id, token, SKIP_CONFIRMATION_EMAIL = 0) => {
  try {
    if (!VALID_TYPE_USERS.includes(type)) {
      throw new Error('The user type is not valid');
    }

    if (!email || !id || !token) {
      throw new Error('The email, the id and the token are required');
    }

    let confirmUrl;
    switch (type) {
      case USER:
        confirmUrl = `${process.env.CONFIRM_USER_LINK_URL_USER}/${id}/${token}`;
        break;
      default:
        throw new Error('The type specified is not valid');
    }

    if (+SKIP_CONFIRMATION_EMAIL) {
      return Promise.resolve();
    }

    return mailjet.post('send', {version: 'v3.1'}).request({
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
          Hi, navigate to the next link to confirm your account: ${confirmUrl}
          \n
          Regards.
          `,
          HTMLPart: `
          Hi,
          <br>
          <br>
          Click on the next link to confirm your account: <a href="${confirmUrl}">${confirmUrl}</a>
          <br>
          Regards.
          `,
          CustomID: process.env.CONFIRM_USER_CUSTOM_ID || 'ConfirmAccount',
        },
      ],
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendConfirmationEmail;
