const { getAllCourses } = require('../../app/backend/controllers/allCoursesController');
const allCoursesService = require('../../app/backend/services/allCoursesService');

// Mock the allCoursesService
jest.mock('../../app/backend/services/allCoursesService', () => ({
  getAllCourses: jest.fn(),
}));

describe('getAllCourses Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return courses when service call is successful', async () => {
    const mockCourses = [
      { id: 1, name: 'Course 1' },
      { id: 2, name: 'Course 2' },
    ];
    allCoursesService.getAllCourses.mockResolvedValue(mockCourses);

    await getAllCourses(mockRequest, mockResponse);

    expect(allCoursesService.getAllCourses).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(mockCourses);
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it('should return 500 status with error message when service call fails', async () => {
    const mockError = new Error('Database error');
    allCoursesService.getAllCourses.mockRejectedValue(mockError);

    await getAllCourses(mockRequest, mockResponse);

    expect(allCoursesService.getAllCourses).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch courses' });
  });
});