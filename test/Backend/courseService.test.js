const { getFormattedCourseData } = require('../../app/backend/services/courseService.js');
const pool = require('../../app/backend/db/index.js');

// Mock the database pool
jest.mock('../../app/backend/db/index.js', () => ({
  query: jest.fn(),
  closePool: jest.fn(),
}));

describe('getFormattedCourseData', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Close the pool after each test
    await pool.closePool();
  });

  it('should return formatted course data for ALL divisions', async () => {
    // Mock the database responses
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            division_courses_count: 5,
            course_number: '101',
            course_title: 'Intro to Computer Science',
            instructor: ['John Doe'],
            ubcid: ['12345678'],
            email: ['john@example.com'],
            division_id: 1,
          },
          {
            division_courses_count: 5,
            course_number: '201',
            course_title: 'Data Structures',
            instructor: ['Jane Smith'],
            ubcid: ['67890123'],
            email: ['jane@example.com'],
            division_id: 1,
          },
          {
            division_courses_count: 5,
            course_number: '100',
            course_title: 'Calculus I',
            instructor: ['Alice Johnson'],
            ubcid: ['11111111'],
            email: ['alice@example.com'],
            division_id: 2,
          },
          {
            division_courses_count: 5,
            course_number: '101',
            course_title: 'Mechanics',
            instructor: ['Bob Wilson'],
            ubcid: ['22222222'],
            email: ['bob@example.com'],
            division_id: 3,
          },
          {
            division_courses_count: 5,
            course_number: '200',
            course_title: 'Introduction to Statistics',
            instructor: ['Carol Brown'],
            ubcid: ['33333333'],
            email: ['carol@example.com'],
            division_id: 4,
          },
        ],
      });

    const result = await getFormattedCourseData('ALL');

    expect(result).toEqual({
      division: 'ALL',
      divisionLabel: 'All',
      currentPage: 1,
      perPage: 10,
      divisionCoursesCount: 5,
      courses: [
        {
          id: 'COSC 101',
          title: 'Intro to Computer Science',
          instructor: ['John Doe'],
          ubcid: ['12345678'],
          email: ['john@example.com'],
        },
        {
          id: 'COSC 201',
          title: 'Data Structures',
          instructor: ['Jane Smith'],
          ubcid: ['67890123'],
          email: ['jane@example.com'],
        },
        {
          id: 'MATH 100',
          title: 'Calculus I',
          instructor: ['Alice Johnson'],
          ubcid: ['11111111'],
          email: ['alice@example.com'],
        },
        {
          id: 'PHYS 101',
          title: 'Mechanics',
          instructor: ['Bob Wilson'],
          ubcid: ['22222222'],
          email: ['bob@example.com'],
        },
        {
          id: 'STAT 200',
          title: 'Introduction to Statistics',
          instructor: ['Carol Brown'],
          ubcid: ['33333333'],
          email: ['carol@example.com'],
        },
      ],
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT'), [0, '20244']);
  });

  it('should return formatted course data for a specific division', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            division_courses_count: 1,
            course_number: '201',
            course_title: 'Data Structures',
            instructor: ['Alice Johnson'],
            ubcid: ['11111111'],
            email: ['alice@example.com'],
            division_id: 1,
          },
        ],
      });

    const result = await getFormattedCourseData('COSC');

    expect(result).toEqual({
      division: 'COSC',
      divisionLabel: 'Computer Science',
      currentPage: 1,
      perPage: 10,
      divisionCoursesCount: 1,
      courses: [
        {
          id: 'COSC 201',
          title: 'Data Structures',
          instructor: ['Alice Johnson'],
          ubcid: ['11111111'],
          email: ['alice@example.com'],
        },
      ],
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT'), [1, '20244']);
  });

  it('should return formatted course data for a course with multiple instructors', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            division_courses_count: 1,
            course_number: '201',
            course_title: 'Data Structures',
            instructor: ['Alice Johnson', 'Bob Jackson'],
            ubcid: ['11111111', '22222222'],
            email: ['alice@example.com', 'bob@example.com'],
            division_id: 1,
          },
        ],
      });

    const result = await getFormattedCourseData('COSC');

    expect(result).toEqual({
      division: 'COSC',
      divisionLabel: 'Computer Science',
      currentPage: 1,
      perPage: 10,
      divisionCoursesCount: 1,
      courses: [
        {
          id: 'COSC 201',
          title: 'Data Structures',
          instructor: ['Alice Johnson', 'Bob Jackson'],
          ubcid: ['11111111', '22222222'],
          email: ['alice@example.com', 'bob@example.com'],
        },
      ],
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT'), [1, '20244']);
  });

  it('should handle empty result set', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await getFormattedCourseData('PHYS');

    expect(result).toEqual({
      division: 'PHYS',
      divisionLabel: 'Physics',
      currentPage: 1,
      perPage: 10,
      divisionCoursesCount: 0,
      courses: [],
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT'), [3, '20244']);
  });

  it('should throw an error when database query fails', async () => {
    pool.query.mockRejectedValue(new Error('Database error'));

    await expect(getFormattedCourseData('MATH')).rejects.toThrow('Database error');

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
  });

  it('should handle invalid division code', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ current_term: '20244' }] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await getFormattedCourseData('INVALID');

    expect(result).toEqual({
      division: 'INVALID',
      divisionLabel: undefined,
      currentPage: 1,
      perPage: 10,
      divisionCoursesCount: 0,
      courses: [],
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT MAX("term") AS current_term FROM public."CourseByTerm";');
    expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT'), [undefined, '20244']);
  });
});