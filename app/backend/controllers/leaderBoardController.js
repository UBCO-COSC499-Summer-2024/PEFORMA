const leaderBoardService = require('../services/leaderBoard');

async function getLeaderBoard(req, res) {
  try {
    const leaderboard = await leaderBoardService.getLeaderBoard();
    res.send(leaderboard);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department leader board' });
  }
}

module.exports = {
    getLeaderBoard
};
