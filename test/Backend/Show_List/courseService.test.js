// courseService.test.js
const { getFormattedCourseData } = require('../../../app/backend/services/ShowList/courseService.js');
const pool = require('../../../app/backend/db/index.js');
const faker = require('faker');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

// Helper function to generate random course data
const generateRandomCourseData = (count) => {
  const courses = [];
  for (let i = 0; i < count; i++) {
    const instructors = Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }, () => `${faker.name.firstName()} ${faker.name.lastName()}`);
    const ubcIds = instructors.map(() => faker.datatype.uuid());
    const emails = instructors.map(() => faker.internet.email());

    courses.push({
      division_courses_count: count,
      course_number: faker.datatype.number({ min: 100, max: 499 }),
      course_title: faker.lorem.words(3),
      instructor: instructors,
      ubcid: ubcIds,
      email: emails,
      division_id: faker.datatype.number({ min: 1, max: 4 })
    });
  }
  return courses;
};

describe('getFormattedCourseData', () => {
  it('should return formatted course data successfully', async () => {
    const mockDivisionCode = 'COSC';
    const mockDivisionId = 1;
    const mockCurrentTerm = '202301';
    const mockCourseData = generateRandomCourseData(5); // Generate 5 random courses

    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ current_term: mockCurrentTerm }] });
    pool.query.mockResolvedValueOnce({ rowCount: mockCourseData.length, rows: mockCourseData });

    const result = await getFormattedCourseData(mockDivisionCode);

    expect(result).toBeDefined();
    expect(result.division).toBe(mockDivisionCode);
    expect(result.courses.length).toBeGreaterThan(0);
  });

  it('should throw an error when the query fails', async () => {
    pool.query.mockRejectedValue(new Error('Database query failed'));

    await expect(getFormattedCourseData('COSC')).rejects.toThrow('Database query failed');
  });
});
