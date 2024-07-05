const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { createAccount } = require('../../app/backend/routes/createAccount');
const bcrypt = require('bcryptjs');
var pool = require('../../app/backend/db/index');

jest.mock('bcryptjs');
jest.mock('../../app/backend/db/index');

describe('createAccount', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        pool = null; // Ensure the pool is closed after all tests
    });

    it('should hash the password and insert the account into the database', async () => {
        const mockProfileId = 1;
        const mockEmail = 'test@example.com';
        const mockPassword = 'password123';
        const mockHashedPassword = 'hashedpassword123';
        const mockAccountId = 123;

        bcrypt.hash.mockResolvedValue(mockHashedPassword);

        pool.query
            .mockResolvedValueOnce({}) // For the sync sequence query
            .mockResolvedValueOnce({ rows: [{ accountId: mockAccountId }] }); // For the insert query

        const accountId = await createAccount(mockProfileId, mockEmail, mockPassword);

        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12);
        expect(pool.query).toHaveBeenCalledTimes(2);

        // Check the second query (insert account)
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringMatching(/INSERT INTO "Account"/), [mockProfileId, mockEmail, mockHashedPassword, true]);

        expect(accountId).toBe(mockAccountId);
    });

    it('should throw an error if hashing fails', async () => {
        const mockProfileId = 1;
        const mockEmail = 'test@example.com';
        const mockPassword = 'password123';

        bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

        await expect(createAccount(mockProfileId, mockEmail, mockPassword)).rejects.toThrow('Hashing failed');
    });

    it('should throw an error if database query fails', async () => {
        const mockProfileId = 1;
        const mockEmail = 'test@example.com';
        const mockPassword = 'password123';
        const mockHashedPassword = 'hashedpassword123';

        bcrypt.hash.mockResolvedValue(mockHashedPassword);
        pool.query.mockRejectedValue(new Error('Database query failed'));

        await expect(createAccount(mockProfileId, mockEmail, mockPassword)).rejects.toThrow('Database query failed');
    });
});
