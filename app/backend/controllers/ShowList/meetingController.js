const meetingService = require('../../services/ShowList/meetingService');

class MeetingController {
  async getMeetings(req, res) {
    try {
      const meetings = await meetingService.getMeetings(); //Execute service
      res.json({ meetings });
    } catch (error) {
      console.error('Error in getMeetings controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new MeetingController();