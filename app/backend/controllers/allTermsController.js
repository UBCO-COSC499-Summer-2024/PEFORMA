const allTermsService = require('../services/allTermsService');

async function getAllTerms(req, res) {
  try {
    const allterms = await allTermsService.getAllTerms();
    res.json(allterms);
  } catch (error) {
    console.error('Error fetching terms:', error);
    res.status(500).json({ error: 'Failed to fetch terms' });
  }
}

module.exports = {
    getAllTerms
};