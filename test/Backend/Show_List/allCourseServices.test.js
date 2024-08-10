const { getAllCourses } = require('../../../app/backend/services/ShowList/allCoursesService.js');
const pool = require('../../../app/backend/db/index.js');
const { updateAllCourses } = require('../../../app/backend/services/UpdateStatus/updateAllCourses.js');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm.js');

// Mock the database pool and other dependencies
jest.mock('../../../app/backend/db/index.js', () => ({
  query: jest.fn(),
}));

jest.mock('../../../app/backend/services/UpdateStatus/updateAllCourses.js', () => ({
  updateAllCourses: jest.fn(),
}));

jest.mock('../../../app/backend/services/latestTerm.js', () => ({
  getLatestTerm: jest.fn(),
}));

describe('getAllCourses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted course data', async () => {
    // Mock return values
    const mockCurrentTerm = '202301';
    getLatestTerm.mockResolvedValue(mockCurrentTerm);
    updateAllCourses.mockResolvedValue();

    const mockRows = [
      { courseId: 1, ctitle: 'Course 1', description: 'Description 1', dcode: 'CS', courseNum: 101, isActive: true },
      { courseId: 2, ctitle: 'Course 2', description: 'Description 2', dcode: 'CS', courseNum: 102, isActive: false },
    ];

    pool.query.mockResolvedValue({ rowCount: mockRows.length, rows: mockRows });

    // Expected output
    const expectedOutput = {
      currentPage: 1,
      perPage: 10,
      currentTerm: mockCurrentTerm,
      coursesCount: mockRows.length,
      courses: mockRows.map(row => ({
        id: row.courseId,
        courseCode: `${row.dcode} ${row.courseNum}`,
        title: row.ctitle,
        description: row.description,
        status: row.isActive,
      })),
    };

    // Call the function
    const result = await getAllCourses();

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error when the query fails', async () => {
    getLatestTerm.mockResolvedValue('202301');
    updateAllCourses.mockResolvedValue();
    pool.query.mockRejectedValue(new Error('Database query failed'));

    await expect(getAllCourses()).rejects.toThrow('Database query failed');
  });
});
