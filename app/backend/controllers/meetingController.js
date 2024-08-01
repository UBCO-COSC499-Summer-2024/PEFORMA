const meetingService = require('../services/meetingService');

class MeetingController {
  async getMeetings(req, res) {
    try {
      const meetings = await meetingService.getMeetings();
      res.json({ meetings });
    } catch (error) {
      console.error('Error in getMeetings controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new MeetingController();