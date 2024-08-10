const { TextEncoder } = require('util');
global.TextEncoder = TextEncoder;
const meetingController = require('../../../app/backend/controllers/ShowList/meetingController');
const meetingService = require('../../../app/backend/services/ShowList/meetingService');

// Mock the meeting service
jest.mock('../../../app/backend/services/ShowList/meetingService');

describe('Meeting Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return meetings when getMeetings is called', async () => {
    const mockMeetings = [
      { id: 1, meetingTitle: 'Test Meeting 1' },
      { id: 2, meetingTitle: 'Test Meeting 2' },
    ];

    meetingService.getMeetings.mockResolvedValue(mockMeetings);

    await meetingController.getMeetings(mockRequest, mockResponse);

    expect(meetingService.getMeetings).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ meetings: mockMeetings });
  });

  it('should handle errors in getMeetings', async () => {
    const mockError = new Error('Service error');
    meetingService.getMeetings.mockRejectedValue(mockError);

    await meetingController.getMeetings(mockRequest, mockResponse);

    expect(meetingService.getMeetings).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});