const createAccountService = require('../services/createAccount');

async function createAccount(req, res) {
  try {
    await createAccountService.createAccount(req); //Execute service
    res.status(201).json({ message: 'Account Created Successfully' });

  } catch (error) {
    console.error('Error creating account:', error);
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create account' });
    }
  }
}

module.exports = {
  createAccount
};
