const { getProgress } = require('../../../app/backend/services/Performance/progress.js');
const pool = require('../../../app/backend/db/index.js');
const { getServiceHour } = require('../../../app/backend/services/Performance/serviceHour.js');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

// Mock the getServiceHour function
jest.mock('../../../app/backend/services/Performance/serviceHour.js', () => {
  return {
    getServiceHour: jest.fn(),
  };
});

describe('getProgress', () => {
  const req = {
    query: {
      profileId: '1',
      currentMonth: '10'
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return expected output', async () => {
    // Mock return values
    getServiceHour.mockResolvedValue({
      rows: [
        { JANHour: 5, FEBHour: 5, MARHour: 5, APRHour: 5, MAYHour: 5, JUNHour: 5, JULHour: 5, AUGHour: 5, SEPHour: 10, OCTHour: 10, NOVHour: 10, DECHour: 10 },
      ]
    });
    pool.query.mockResolvedValueOnce({
      rows: [{ sRoleBenchmark: 20 }]
    });

    // Expected output
    const expectedOutput = {
      series: [50] // 50% progress rate because 10 hours (SEP) / 20 benchmark * 1 month (countMonth) = 50%
    };

    // Call the function
    const result = await getProgress(req);

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error when profile is not found', async () => {
    getServiceHour.mockResolvedValue({
      rows: [
        { JANHour: 5, FEBHour: 5, MARHour: 5, APRHour: 5, MAYHour: 5, JUNHour: 5, JULHour: 5, AUGHour: 5, SEPHour: 10, OCTHour: 10, NOVHour: 10, DECHour: 10 },
      ]
    });
    pool.query.mockResolvedValueOnce({ rows: [] });

    await expect(getProgress(req)).rejects.toThrow('Profile not found');
  });

  it('should throw an error when the query fails', async () => {
    getServiceHour.mockRejectedValue(new Error('Service hour query failed'));
    await expect(getProgress(req)).rejects.toThrow('Service hour query failed');
  });
});
