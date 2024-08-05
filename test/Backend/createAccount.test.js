const { createAccount } = require('../../app/backend/services/createAccount.js');
const pool = require('../../app/backend/db/index.js');
const bcrypt = require('bcryptjs');

// Mock the database pool
jest.mock('../../app/backend/db/index.js', () => {
  return {
    connect: jest.fn(),
  };
});

// Mock the bcrypt module
jest.mock('bcryptjs', () => {
  return {
    hash: jest.fn(),
  };
});

describe('createAccount', () => {
  let client;
  let req;

  beforeEach(() => {
    client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);

    req = {
      body: {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        ubcId: '12345678',
        division: '1',
        accountType: ['type1', 'type2'],
      },
    };

    jest.clearAllMocks();
  });

  it('should create a new account successfully', async () => {
    // Mock database responses
    client.query
      .mockResolvedValueOnce({ rows: [] }) // emailCheckResult
      .mockResolvedValueOnce({ rows: [] }) // setval for Profile
      .mockResolvedValueOnce({ rows: [{ profileId: 1 }] }) // insert into Profile
      .mockResolvedValueOnce({ rows: [{ profileId: 1 }] }) // setval for Account
      .mockResolvedValueOnce({ rows: [{ accountId: 1 }] }) // insert into Account
      .mockResolvedValue({ rows: [{ accountId: 1 }] }); // insert into AccountType

    // Mock bcrypt responses
    bcrypt.hash.mockResolvedValue('hashedPassword');

    // Call the function
    const result = await createAccount(req);

    // Assert the result
    expect(result).toBe(true);
  });

  it('should throw an error if email already exists', async () => {
    client.query.mockRejectedValue(new Error('Email already exists'));

    await expect(createAccount(req)).rejects.toThrow('Email already exists');
  });

  it('should throw an error if there is a database error', async () => {
    client.query.mockRejectedValue(new Error('Database query failed'));

    await expect(createAccount(req)).rejects.toThrow('Database query failed');
  });
});
