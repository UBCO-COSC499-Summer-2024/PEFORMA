const deptLeaderBoardService = require('../../services/Performance/deptLeaderBoard');

async function getDeptLeaderBoard(req, res) {
  try {
    const leaderboard = await deptLeaderBoardService.getDeptLeaderBoard();//Execute service
    res.send(leaderboard);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department leader board' });
  }
}

module.exports = {
    getDeptLeaderBoard
};
