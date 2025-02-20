const leaderBoardService = require('../../services/Performance/leaderBoard');

async function getLeaderBoard(req, res) {
  try {
    const leaderboard = await leaderBoardService.getLeaderBoard();//Execute service
    res.send(leaderboard);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leader board' });
  }
}

module.exports = {
    getLeaderBoard
};
