const  pool = require('../db/index.js'); 

 async function setCurrentTerm(req)  {
    const { term } = req.body;
    try {
        const query = 'UPDATE "CurrentTerm" SET "curTerm" = $1 WHERE "curTerm" IS NOT NULL';
        await pool.query(query, [term]);
        return true;
    } catch (error) {
        console.error('Error updating current term:', error);
        throw error;
    }
};

module.exports = {
    setCurrentTerm,
};