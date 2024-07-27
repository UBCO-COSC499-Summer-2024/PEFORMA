const decryptEmailService = require('../services/decryptEmailService');

async function decryptEmail(req, res) {
  try {
    const email = await decryptEmailService.decryptEmail(req);
    res.json(email);

  } catch (error) {
    console.error('error', error);
    res.status(500).json({ error: 'Failed to decrypt' });
  }
}

module.exports = {
  decryptEmail
};
