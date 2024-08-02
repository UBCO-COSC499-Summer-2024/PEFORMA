const { getDepartPerformance } = require('../../../app/backend/services/Performance/deptPerformance.js');
const pool = require('../../../app/backend/db/index.js');

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

const { getLatestTerm } = require('../../../app/backend/services/latestTerm.js');

describe('getDepartPerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return expected output', async () => {
    // Mock return values
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockResolvedValue({
      rows: [
        { divisionId: 1, average_score: 85.1234 },
        { divisionId: 2, average_score: 78.5678 },
        { divisionId: 3, average_score: 92.4321 },
        { divisionId: 4, average_score: 88.8765 }
      ]
    });

    // Expected output
    const expectedOutput = {
      series: [85.12, 78.57, 92.43, 88.88],
      labels: ["Computer Science", "Mathematics", "Physics", "Statistics"]
    };

    // Call the function
    const result = await getDepartPerformance();

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should handle no data found scenario by returning zeroed series', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockResolvedValue({ rows: [] });

    // Expected output when no data is found
    const expectedOutput = {
      series: [0, 0, 0, 0],
      labels: ["Computer Science", "Mathematics", "Physics", "Statistics"]
    };

    // Call the function
    const result = await getDepartPerformance();

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error when the query fails', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockRejectedValue(new Error('Database query failed'));

    await expect(getDepartPerformance()).rejects.toThrow('Database query failed');
  });
});
