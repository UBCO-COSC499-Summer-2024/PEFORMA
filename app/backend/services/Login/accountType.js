const pool = require('../../db/index.js');

async function queryAccountType(accountId) {
  try {
    const client = await pool.connect();
    //Retrieve all account type of the user
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
module.exports = {
    queryAccountType
}
