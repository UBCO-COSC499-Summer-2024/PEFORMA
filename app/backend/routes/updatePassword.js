const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db/index.js');

router.post('/update-password', async (req, res) => {
  const { password } = req.body;
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Account" WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query('UPDATE public."Account" SET password = $1 WHERE email = $2', [hashedPassword, email]);
    client.release();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
});

module.exports = router;
