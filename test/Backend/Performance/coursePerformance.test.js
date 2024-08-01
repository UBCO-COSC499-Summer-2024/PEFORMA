const { getCoursePerformance } = require('../../../app/backend/services/Performance/coursePerformance.js');
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

describe('getCoursePerformance', () => {
  let req;

  beforeEach(() => {
    req = {
      query: {
        divisionId: '1',
      },
    };
    jest.clearAllMocks();
  });

  it('should return course performance', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          DivisionAndCourse: 'CS 101',
          AverageScore: 95,
        },
      ],
    });

    const expectedOutput = {
      courses: [
        { courseCode: 'CS 101', rank: 'A', score: '95.00' },
      ],
      currentTerm: '202301',
    };

    const result = await getCoursePerformance(req);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle errors and throw an error when the query fails', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockRejectedValue(new Error('Database query failed'));

    await expect(getCoursePerformance(req)).rejects.toThrow('Database query failed');
  });
});
