const { getCourseEvaluation } = require('../../../app/backend/services/CourseEvaluation/courseEvaluation.js');
const pool = require('../../../app/backend/db/index.js');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm.js');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

// Mock the getLatestTerm function
jest.mock('../../../app/backend/services/latestTerm.js', () => {
  return {
    getLatestTerm: jest.fn(),
  };
});

describe('getCourseEvaluation', () => {
  let req;

  beforeEach(() => {
    req = {
      body: {
        courseId: 1,
        profileId: 1,
        Q1: 4,
        Q2: 4,
        Q3: 4,
        Q4: 4,
        Q5: 4,
        Q6: 4,
        retentionRate: 80,
        averageGrade: 85,
        enrollmentRate: 90,
        failedPercentage: 10,
      },
    };
    jest.clearAllMocks();
  });

  it('should return true when a new course evaluation is inserted', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // checkExistingEvaluation result
      .mockResolvedValueOnce({ rows: [] }) // insertCourseEvaluation result
      .mockResolvedValueOnce({ rows: [] }); // updateTeachingPerformance result

    // Call the function
    const result = await getCourseEvaluation(req);

    // Assert the result
    expect(result).toBe(true);
  });

  it('should return true when the course evaluation is updated', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query
      .mockResolvedValueOnce({ rows: [{ courseId: 1 }] }) // checkExistingEvaluation result
      .mockResolvedValueOnce({ rows: [] }) // fake insert CourseEvaluation result do nothing
      .mockResolvedValueOnce({ rows: [] }); // updateTeachingPerformance result

    // Call the function
    const result = await getCourseEvaluation(req);

    // Assert the result
    expect(result).toBe(true);
  });

  it('should throw an error when the query fails', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockRejectedValue(new Error('Database query failed'));

    await expect(getCourseEvaluation(req)).rejects.toThrow();
  });
});
