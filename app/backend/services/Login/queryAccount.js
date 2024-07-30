const pool = require('../../db/index');
async function queryAccount(){
    try {
      //Get all accounts
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM public."Account"'); 
        client.release();
        return result.rows;
      } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
      }
}
module.exports = {
    queryAccount
}