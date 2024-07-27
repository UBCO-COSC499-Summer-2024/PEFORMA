
const crypto = require('crypto');
const secretKey = 'turkeysandwich';
async function decryptEmail(req) {
  try {
    console.log(req.body.params);
    const {encryptedEmail} = req.body.params;
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decryptedEmail = decipher.update(encryptedEmail, 'hex', 'utf-8');
    decryptedEmail += decipher.final('utf-8');
    return decryptedEmail;
  } catch (error) {
    throw error; 
  }
}

module.exports = {
  decryptEmail
};
