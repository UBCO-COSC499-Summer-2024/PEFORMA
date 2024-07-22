const express = require('express');
const { getAllTerms } = require('../services/allTermsService'); 
const router = express.Router();

router.get('/terms', async (req, res) => {
    try {
        const termsData = await getAllTerms();
        res.json(termsData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get terms data' });
    }
});

module.exports = router;
