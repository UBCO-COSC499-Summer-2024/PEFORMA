const bcrypt = require('bcryptjs');
const pool = require('../../db/index.js');


async function updatePassword(req)  {
  const { password } = req.body;
  const email = req.query.email;

  if (!email) {
    throw new Error('Invalid email');
  }

  try {
    const client = await pool.connect();
    //Check if account exists
    const result = await client.query('SELECT * FROM public."Account" WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      client.release();
      throw new Error('User not found');
    }
    //Hash new password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    //Update the password
    await client.query('UPDATE public."Account" SET password = $1 WHERE email = $2', [hashedPassword, email]);
    client.release();

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
    updatePassword
}
