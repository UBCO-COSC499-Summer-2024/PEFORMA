const { queryAccount } = require('../../../app/backend/services/Login/queryAccount.js');
const pool = require('../../../app/backend/db/index.js');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    connect: jest.fn(),
  };
});

describe('queryAccount', () => {
  let client;

  beforeEach(() => {
    client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);
    jest.clearAllMocks();
  });

  it('should return expected output', async () => {
    // Mock return values
    const mockRows = [
      { accountId: 1, accountName: 'Account1' },
      { accountId: 2, accountName: 'Account2' },
    ];
    client.query.mockResolvedValue({ rows: mockRows });

    // Expected output
    const expectedOutput = mockRows;

    // Call the function
    const result = await queryAccount();

    // Assert the result
    expect(result).toEqual(expectedOutput);
    expect(client.query).toHaveBeenCalledWith('SELECT * FROM public."Account" WHERE "isActive" = TRUE');
    expect(client.release).toHaveBeenCalled();
  });

  it('should throw an error when the query fails', async () => {
    client.query.mockRejectedValue(new Error('Database query failed'));

    await expect(queryAccount()).rejects.toThrow('Database query failed');
    expect(client.release).toHaveBeenCalledTimes(0);
  });
});
