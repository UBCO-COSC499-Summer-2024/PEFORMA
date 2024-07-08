const courseController = require('../../app/backend/controllers/courseController.js');
const courseService = require('../../app/backend/services/courseService.js');

// Mock the courseService
jest.mock('../../app/backend/services/courseService.js');

describe('courseController', () => {
  let mockRequest;
  let mockResponse;
  let mockJsonFunction;

  beforeEach(() => {
    mockJsonFunction = jest.fn();
    mockRequest = {
      query: {}
    };
    mockResponse = {
      json: mockJsonFunction,
      status: jest.fn().mockReturnThis()
    };
  });

  it('should return formatted course data for a given division', async () => {
    const mockFormattedData = {
      division: 'COSC',
      courses: [{ id: 'COSC101', title: 'Intro to Programming' }]
    };
    courseService.getFormattedCourseData.mockResolvedValue(mockFormattedData);

    mockRequest.query.division = 'COSC';

    await courseController.getCourses(mockRequest, mockResponse);

    expect(courseService.getFormattedCourseData).toHaveBeenCalledWith('COSC');
    expect(mockJsonFunction).toHaveBeenCalledWith(mockFormattedData);
  });

  it('should handle errors and return a 500 status', async () => {
    courseService.getFormattedCourseData.mockRejectedValue(new Error('Database error'));

    mockRequest.query.division = 'INVALID';

    await courseController.getCourses(mockRequest, mockResponse);

    expect(courseService.getFormattedCourseData).toHaveBeenCalledWith('INVALID');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockJsonFunction).toHaveBeenCalledWith({ error: 'An error occurred' });
  });
});