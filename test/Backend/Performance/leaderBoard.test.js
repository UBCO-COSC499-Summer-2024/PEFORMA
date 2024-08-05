const { getLeaderBoard } = require('../../../app/backend/services/Performance/leaderBoard.js');
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

describe('getLeaderBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return expected output', async () => {
    // Mock return values
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockResolvedValue({
      rows: [
        { full_name: 'John Doe', average_score: 95 },
        { full_name: 'Jane Smith', average_score: 90 },
        { full_name: 'Alice Johnson', average_score: 85 },
        { full_name: 'Bob Brown', average_score: 80 },
        { full_name: 'Charlie Davis', average_score: 75 }
      ]
    });

    // Expected output
    const expectedOutput = {
      data: [
        { x: 'John Doe', y: 95.0 },
        { x: 'Jane Smith', y: 90.0 },
        { x: 'Alice Johnson', y: 85.0 },
        { x: 'Bob Brown', y: 80.0 },
        { x: 'Charlie Davis', y: 75.0 }
      ]
    };

    // Call the function
    const result = await getLeaderBoard();

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error when no data is found', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockResolvedValue({ rows: [] });

    await expect(getLeaderBoard()).rejects.toThrow('No data found');
  });

  it('should throw an error when the query fails', async () => {
    getLatestTerm.mockResolvedValue('202301');
    pool.query.mockRejectedValue(new Error('Database query failed'));

    await expect(getLeaderBoard()).rejects.toThrow('Database query failed');
  });
});
