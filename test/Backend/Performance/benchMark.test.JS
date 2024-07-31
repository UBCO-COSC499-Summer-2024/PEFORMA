const { getBenchmark } = require('../../../app/backend/services/Performance/benchmark.js');
const pool = require('../../../app/backend/db/index.js');
const { getLatestYear } = require('../../../app/backend/services/latestYear.js');

// Mock the database pool
jest.mock('../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

// Mock the getLatestYear function
jest.mock('../../app/backend/services/latestYear.js', () => {
  return {
    getLatestYear: jest.fn(),
  };
});

describe('getBenchmark', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return expected output for October', async () => {
    const mockDate = new Date(2023, 9); // October 2023
    jest.useFakeTimers().setSystemTime(mockDate);

    // Mock return values
    getLatestYear.mockResolvedValue(2023);
    pool.query.mockResolvedValueOnce({
      rows: [
        { profileId: 1, full_name: 'John Doe', sRoleBenchmark: 10, total_hours: 8 },
        { profileId: 2, full_name: 'Jane Smith', sRoleBenchmark: 15, total_hours: 12 }
      ]
    });

    // Expected output
    const expectedOutput = {
      people: [
        { name: 'John Doe', shortage: 2 },
        { name: 'Jane Smith', shortage: 3 }
      ]
    };

    // Call the function
    const result = await getBenchmark();

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should return expected output for November', async () => {
    const mockDate = new Date(2023, 10); // November 2023
    jest.useFakeTimers().setSystemTime(mockDate);

    // Mock return values
    getLatestYear.mockResolvedValue(2023);
    pool.query.mockResolvedValueOnce({
      rows: [
        { profileId: 1, full_name: 'John Doe', sRoleBenchmark: 10, total_hours: 8 },
        { profileId: 2, full_name: 'Jane Smith', sRoleBenchmark: 15, total_hours: 12 }
      ]
    });

    // Expected output
    const expectedOutput = {
      people: [
        { name: 'John Doe', shortage: 12 },
        { name: 'Jane Smith', shortage: 18 }
      ]
    };

    // Call the function
    const result = await getBenchmark();

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error when no data is found', async () => {
    const mockDate = new Date(2023, 8); // September 2023
    jest.useFakeTimers().setSystemTime(mockDate);

    getLatestYear.mockResolvedValue(2023);

    await expect(getBenchmark()).rejects.toThrow('No benchmark data');
  });

  it('should throw an error when the query fails', async () => {
    getLatestYear.mockResolvedValue(2023);
    pool.query.mockRejectedValue(new Error('No benchmark data'));

    await expect(getBenchmark()).rejects.toThrow('No benchmark data');
  });
});
