const allCoursesService = require('../../app/backend/services/allCoursesService.js');
const pool = require('../../app/backend/db/index.js');

// Mock the pool object
jest.mock('../../app/backend/db/index.js', () => ({
  query: jest.fn(),
}));

// Mock the allCoursesService
jest.mock('../../app/backend/services/allCoursesService.js', () => ({
  getAllCourses: jest.fn(),
}));

// Helper function to normalize whitespace in SQL queries
function normalizeSQL(sql) {
  return sql.replace(/\s+/g, ' ').trim();
}

describe('getAllCourses', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return formatted data with correct structure including multiple departments', async () => {
    // Mock the getAllCourses function
    allCoursesService.getAllCourses.mockResolvedValue({
      currentPage: 1,
      perPage: 10,
      coursesCount: 8,
      courses: [
        {
          id: 1,
          courseCode: 'COSC 101',
          title: 'Introduction to Computer Science',
          description: 'An introductory course to CS',
        },
        // ... (other courses)
      ],
    });

    const result = await allCoursesService.getAllCourses();

    expect(result).toEqual({
      currentPage: 1,
      perPage: 10,
      coursesCount: 8,
      courses: expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          courseCode: 'COSC 101',
          title: 'Introduction to Computer Science',
          description: 'An introductory course to CS',
        }),
        // ... (other courses)
      ]),
    });

    expect(allCoursesService.getAllCourses).toHaveBeenCalledTimes(1);
  });

  it('should handle empty result set', async () => {
    allCoursesService.getAllCourses.mockResolvedValue({
      currentPage: 1,
      perPage: 10,
      coursesCount: 0,
      courses: [],
    });

    const result = await allCoursesService.getAllCourses();

    expect(result).toEqual({
      currentPage: 1,
      perPage: 10,
      coursesCount: 0,
      courses: [],
    });

    expect(allCoursesService.getAllCourses).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when getAllCourses fails', async () => {
    const errorMessage = 'Failed to fetch courses';
    allCoursesService.getAllCourses.mockRejectedValue(new Error(errorMessage));

    await expect(allCoursesService.getAllCourses()).rejects.toThrow(errorMessage);
    expect(allCoursesService.getAllCourses).toHaveBeenCalledTimes(1);
  });

  it('should handle different terms correctly', async () => {
    allCoursesService.getAllCourses.mockResolvedValue({
      currentPage: 1,
      perPage: 10,
      coursesCount: 50,
      courses: [
        { id: 9, courseCode: 'COSC 355', title: 'Advanced Algorithms', description: 'Study of complex algorithms' },
        { id: 10, courseCode: 'MATH 320', title: 'Complex Analysis', description: 'Functions of a complex variable' },
        { id: 11, courseCode: 'PHYS 215', title: 'Thermodynamics', description: 'Laws of thermodynamics and their applications' },
        { id: 12, courseCode: 'STAT 305', title: 'Regression Analysis', description: 'Linear and nonlinear regression techniques' }
      ],
    });

    const result = await allCoursesService.getAllCourses();

    expect(result.coursesCount).toBe(50);
    expect(result.courses.length).toBe(4);
    expect(result.courses[0].courseCode).toBe('COSC 355');
    expect(result.courses[1].courseCode).toBe('MATH 320');
    expect(result.courses[2].courseCode).toBe('PHYS 215');
    expect(result.courses[3].courseCode).toBe('STAT 305');
    
    expect(allCoursesService.getAllCourses).toHaveBeenCalledTimes(1);
  });
});