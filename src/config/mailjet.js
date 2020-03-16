const Mailjet = require('node-mailjet');

const connection = Mailjet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

module.exports = connection;
