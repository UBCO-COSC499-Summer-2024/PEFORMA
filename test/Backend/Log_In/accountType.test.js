const { queryAccountType } = require('../../../app/backend/services/Login/accountType.js');
const pool = require('../../../app/backend/db/index.js');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => ({
  connect: jest.fn(),
}));

describe('queryAccountType', () => {
  let client;

  beforeEach(() => {
    client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);
    jest.clearAllMocks();
  });

  it('should return expected account types', async () => {
    // Mock return values
    const accountId = 1;
    const mockRows = [
      { accountType: 'Savings' },
      { accountType: 'Checking' },
    ];
    client.query.mockResolvedValue({ rows: mockRows });

    // Call the function
    const result = await queryAccountType(accountId);

    // Assert the result
    expect(result).toEqual(mockRows.map(row => row.accountType));
    expect(client.query).toHaveBeenCalledWith('SELECT "accountType" FROM public."AccountType" WHERE "accountId" = $1', [accountId]);
    expect(client.release).toHaveBeenCalled();
  });

  it('should throw an error when account type is not found', async () => {
    const accountId = 1;
    client.query.mockResolvedValue({ rows: [] });

    await expect(queryAccountType(accountId)).rejects.toThrow('Account type not found');
    expect(client.release).toHaveBeenCalled();
  });

  it('should throw an error when the query fails', async () => {
    const accountId = 1;
    client.query.mockRejectedValue(new Error('Database query failed'));

    await expect(queryAccountType(accountId)).rejects.toThrow('Database query failed');
    expect(client.release).toHaveBeenCalledTimes(0);
  });
});
