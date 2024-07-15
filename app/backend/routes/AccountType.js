const express = require('express');
const router = express.Router();
const pool = require('../db/index.js');

const queryAccountType = async (accountId) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT "accountType" FROM public."AccountType" WHERE "accountId" = $1', [accountId]);
    client.release();
    if (result.rows.length > 0) {
      return result.rows.map(row => row.accountType); // return all acc types
    } else {
      throw new Error('Account type not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

router.get('/accountType/:accountId', async (req, res) => {
  const accountId = parseInt(req.params.accountId, 10);
  try {
    const accountTypes = await queryAccountType(accountId);
    res.json({ success: true, accountTypes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
