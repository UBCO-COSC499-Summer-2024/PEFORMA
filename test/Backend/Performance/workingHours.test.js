const { getWorkingHours } = require('../../../app/backend/services/Performance/workingHours.js');
const { getServiceHour } = require('../../../app/backend/services/Performance/serviceHour.js');

// Mock the getServiceHour function
jest.mock('../../../app/backend/services/Performance/serviceHour.js', () => {
  return {
    getServiceHour: jest.fn(),
  };
});

describe('getWorkingHours', () => {
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

    // Expected output
    const expectedOutput = {
      data: [
        { x: "September", y: 10 }
      ]
    };

    // Call the function
    const result = await getWorkingHours(req);
    console.log(result);

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should handle no data found scenario', async () => {
    getServiceHour.mockResolvedValue({ rows: [] });

    // Expected output when no data is found
    const expectedOutput = {
      data: [
        { x: "September", y: 0 }
      ]
    };

    // Call the function
    const result = await getWorkingHours(req);

    // Assert the result
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error when the query fails', async () => {
    getServiceHour.mockRejectedValue(new Error(''));

    await expect(getWorkingHours(req)).rejects.toThrow('');
  });
});
