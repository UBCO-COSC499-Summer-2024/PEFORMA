const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 定义查询函数
const queryAccountType = async (accountId) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT "accountType" FROM public."AccountType" WHERE "accountId" = $1', [accountId]);
    client.release();
    if (result.rows.length > 0) {
      return result.rows[0].accountType;
    } else {
      throw new Error('Account type not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

// 定义路由
router.get('/accountType/:accountId', async (req, res) => {
  const accountId = parseInt(req.params.accountId, 10);
  try {
    const accountType = await queryAccountType(accountId);
    res.json({ success: true, accountType });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
