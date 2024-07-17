const express = require('express');
const router = express.Router();
const { assignServiceRole } = require('./assignServiceRole'); // Update the path accordingly

router.post('/assignInstructorServiceRole', async (req, res) => {
    const { profileId, serviceRole, year, division } = req.body;
    try {
        const result = await assignServiceRole(profileId, serviceRole, year, division);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error assigning service role:', error.message);
        res.status(500).send('Error assigning service role');
    }
});

module.exports = router;