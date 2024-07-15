const createAccountService = require('../services/createAccount');

async function createAccount(req, res) {
  try {
    await createAccountService.createAccount(req);
    res.status(201).json({ message: 'Account Created Successfully' });

  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
}

module.exports = {
  createAccount
};
