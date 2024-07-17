const deptLeaderBoardService = require('../services/deptLeaderBoard');

async function getDeptLeaderBoard(req, res) {
  try {
    const leaderboard = await deptLeaderBoardService.getDeptLeaderBoard();
    res.send(leaderboard);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department leader board' });
  }
}

module.exports = {
    getDeptLeaderBoard
};
