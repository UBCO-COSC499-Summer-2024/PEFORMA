const { getAllCourses } = require('../../app/backend/services/allCoursesService.js');
const pool = require('../../app/backend/db/index.js');

// Mock the pool object
jest.mock('../../app/backend/db/index.js', () => ({
  query: jest.fn(),
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
    // Mock the database responses
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({ rows: [{ count: '8' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            courseId: 1,
            ctitle: 'Introduction to Computer Science',
            description: 'An introductory course to CS',
            dcode: 'COSC',
            courseNum: '101',
          },
          {
            courseId: 2,
            ctitle: 'Data Structures',
            description: 'A course on data structures',
            dcode: 'COSC',
            courseNum: '201',
          },
          {
            courseId: 3,
            ctitle: 'Calculus I',
            description: 'Introduction to differential calculus',
            dcode: 'MATH',
            courseNum: '100',
          },
          {
            courseId: 4,
            ctitle: 'Linear Algebra',
            description: 'Study of vector spaces and linear transformations',
            dcode: 'MATH',
            courseNum: '221',
          },
          {
            courseId: 5,
            ctitle: 'Classical Mechanics',
            description: 'Newtonian mechanics and its applications',
            dcode: 'PHYS',
            courseNum: '111',
          },
          {
            courseId: 6,
            ctitle: 'Quantum Mechanics',
            description: 'Introduction to quantum theory',
            dcode: 'PHYS',
            courseNum: '200',
          },
          {
            courseId: 7,
            ctitle: 'Probability Theory',
            description: 'Fundamentals of probability and random variables',
            dcode: 'STAT',
            courseNum: '230',
          },
          {
            courseId: 8,
            ctitle: 'Statistical Inference',
            description: 'Methods of statistical inference and hypothesis testing',
            dcode: 'STAT',
            courseNum: '301',
          },
        ],
      });

    const result = await getAllCourses();

    expect(result).toEqual({
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
        {
          id: 2,
          courseCode: 'COSC 201',
          title: 'Data Structures',
          description: 'A course on data structures',
        },
        {
          id: 3,
          courseCode: 'MATH 100',
          title: 'Calculus I',
          description: 'Introduction to differential calculus',
        },
        {
          id: 4,
          courseCode: 'MATH 221',
          title: 'Linear Algebra',
          description: 'Study of vector spaces and linear transformations',
        },
        {
          id: 5,
          courseCode: 'PHYS 111',
          title: 'Classical Mechanics',
          description: 'Newtonian mechanics and its applications',
        },
        {
          id: 6,
          courseCode: 'PHYS 200',
          title: 'Quantum Mechanics',
          description: 'Introduction to quantum theory',
        },
        {
          id: 7,
          courseCode: 'STAT 230',
          title: 'Probability Theory',
          description: 'Fundamentals of probability and random variables',
        },
        {
          id: 8,
          courseCode: 'STAT 301',
          title: 'Statistical Inference',
          description: 'Methods of statistical inference and hypothesis testing',
        },
      ],
    });

    expect(pool.query).toHaveBeenCalledTimes(3);
  });

  it('should handle empty result set', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({ rows: [{ count: '0' }] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await getAllCourses();

    expect(result).toEqual({
      currentPage: 1,
      perPage: 10,
      coursesCount: 0,
      courses: [],
    });

    expect(pool.query).toHaveBeenCalledTimes(3);
  });

  it('should throw an error when database query fails', async () => {
    const errorMessage = 'Database connection failed';
    pool.query.mockRejectedValue(new Error(errorMessage));

    await expect(getAllCourses()).rejects.toThrow(errorMessage);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it('should use the correct SQL queries', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({ rows: [{ count: '100' }] })
      .mockResolvedValueOnce({ rows: [] });

    await getAllCourses();

    const expectedQueries = [
      'SELECT MAX("term") AS current_term FROM public."CourseByTerm";',
      'SELECT COUNT(*) FROM public."CourseByTerm" WHERE "term" = $1',
      'SELECT c."courseId", c."ctitle", c."description", d."dcode", c."courseNum" FROM public."Course" c JOIN public."CourseByTerm" cbt ON c."courseId" = cbt."courseId" JOIN public."Division" d ON c."divisionId" = d."divisionId" WHERE cbt."term" = $1 ORDER BY c."divisionId" ASC, c."courseNum" ASC;'
    ];

    expect(pool.query).toHaveBeenCalledTimes(3);

    for (let i = 0; i < 3; i++) {
      const call = pool.query.mock.calls[i];
      expect(normalizeSQL(call[0])).toBe(normalizeSQL(expectedQueries[i]));
    }

    // Check parameters for the second and third queries
    expect(pool.query.mock.calls[1][1]).toEqual(['20244']);
    expect(pool.query.mock.calls[2][1]).toEqual(['20244']);
  });

  it('should handle different terms correctly', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20251' }] })
      .mockResolvedValueOnce({ rows: [{ count: '50' }] })
      .mockResolvedValueOnce({ 
        rows: [
          { courseId: 9, ctitle: 'Advanced Algorithms', description: 'Study of complex algorithms', dcode: 'COSC', courseNum: '355' },
          { courseId: 10, ctitle: 'Complex Analysis', description: 'Functions of a complex variable', dcode: 'MATH', courseNum: '320' },
          { courseId: 11, ctitle: 'Thermodynamics', description: 'Laws of thermodynamics and their applications', dcode: 'PHYS', courseNum: '215' },
          { courseId: 12, ctitle: 'Regression Analysis', description: 'Linear and nonlinear regression techniques', dcode: 'STAT', courseNum: '305' }
        ] 
      });

    const result = await getAllCourses();

    expect(result.coursesCount).toBe(50);
    expect(result.courses.length).toBe(4);
    expect(result.courses[0].courseCode).toBe('COSC 355');
    expect(result.courses[1].courseCode).toBe('MATH 320');
    expect(result.courses[2].courseCode).toBe('PHYS 215');
    expect(result.courses[3].courseCode).toBe('STAT 305');
    
    const calls = pool.query.mock.calls;
    expect(normalizeSQL(calls[1][0])).toContain('WHERE "term" = $1');
    expect(calls[1][1]).toEqual(['20251']);
    expect(normalizeSQL(calls[2][0])).toContain('WHERE cbt."term" = $1');
    expect(calls[2][1]).toEqual(['20251']);
  });
});