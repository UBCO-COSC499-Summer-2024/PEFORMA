const progressService = require('../services/Performance/progress');

async function getProgress(req, res) {
  try {
    const progress = await progressService.getProgress(req);
    res.send(progress);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
}

module.exports = {
  getProgress
};
