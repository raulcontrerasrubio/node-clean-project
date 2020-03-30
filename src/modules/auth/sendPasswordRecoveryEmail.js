const mailjet = require('../../config/mailjet');
const {User} = require('../../database/models');
const {USER} = require('../../config/config');

/**
 * @name sendPasswordRecoveryEmail
 * @function
 * @async
 * @memberof module:Auth
 * @description Sends an email to a user to reset their password
 * @param {string} email User email
 * @param {string} type User type
 * @param {object} [options={}] Additional config options
 * @param {number} [options.SKIP_RESET_PASSWORD_EMAIL] If 1, the email is not sent
 */
const sendPasswordRecoveryEmail = async (email, type, options = {}) => {
  try {
    const {SKIP_RESET_PASSWORD_EMAIL} = options;
    if (+SKIP_RESET_PASSWORD_EMAIL) {
      return true;
    }

    if (!email) {
      return false;
    }

    const getAccountData = async Model => {
      return await Model.findOne({
        where: {
          email,
          confirmed: 1,
        },
      });
    };

    let resetUrl;
    switch (type) {
      case USER:
        {
          const user = await getAccountData(User);
          if (!user) {
            return false;
          }
          resetUrl = `${process.env.REMEMBER_PASSWORD_LINK_URL_USER}/${user.id}/${user.token}`;
        }
        break;
      default:
        throw new Error('The type specified is not valid');
    }

    await mailjet.post('send', {version: 'v3.1'}).request({
      Messages: [
        {
          From: {
            Email: process.env.REMEMBER_PASSWORD_FROM_EMAIL,
            Name: process.env.REMEMBER_PASSWORD_FROM_NAME,
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: process.env.REMEMBER_PASSWORD_EMAIL_SUBJECT,
          TextPart: `
          Hi, navigate to the next link to reset your password: ${resetUrl}
          \n
          Regards.
          `,
          HTMLPart: `
          Hi,
          <br>
          <br>
          Click on the next link to reset your password: <a href="${resetUrl}">${resetUrl}</a>
          <br>
          Regards.
          `,
          CustomID: process.env.REMEMBER_PASSWORD_CUSTOM_ID || 'ResetPassword',
        },
      ],
    });

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendPasswordRecoveryEmail;
