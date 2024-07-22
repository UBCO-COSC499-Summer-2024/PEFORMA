const  pool = require('../db/index.js'); 

const setCurrentTerm = async (req, res) => {
    const { term } = req.body;
    try {
        const query = 'UPDATE "CurrentTerm" SET "curTerm" = $1 WHERE "curTerm" IS NOT NULL';
        await pool.query(query, [term]);
        res.status(200).json({ message: 'Current term updated successfully' });
    } catch (error) {
        console.error('Error updating current term:', error);
        res.status(500).json({ error: 'Failed to update current term' });
    }
};

module.exports = {
    setCurrentTerm,
};