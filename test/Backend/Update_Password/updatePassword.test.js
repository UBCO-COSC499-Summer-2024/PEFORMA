const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const bcrypt = require('bcryptjs');
const { updatePassword } = require('../../../app/backend/services/UpdatePassword/updatePassword');
const pool = require('../../../app/backend/db/index');

jest.mock('bcryptjs');
jest.mock('../../../app/backend/db/index');

describe('updatePassword', () => {
    let req;
    let mockClient;

    beforeEach(() => {
        req = {
            body: {
                password: 'newpassword123'
            },
            query: {
                email: 'test@example.com'
            }
        };

        mockClient = {
            query: jest.fn(),
            release: jest.fn()
        };

        pool.connect = jest.fn().mockResolvedValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the password for the given email', async () => {
        mockClient.query.mockResolvedValueOnce({ rows: [{ email: 'test@example.com' }] }); // Select query
        bcrypt.hash.mockResolvedValueOnce('hashedpassword123');
        mockClient.query.mockResolvedValueOnce({}); // Update query

        const result = await updatePassword(req);
        expect(result).toBe(true);
    });

    it('should throw an error if the email is not provided', async () => {
        req.query.email = '';

        await expect(updatePassword(req)).rejects.toThrow('Invalid email');
    });

    it('should throw an error if the user is not found', async () => {
        mockClient.query.mockResolvedValueOnce({ rows: [] });

        await expect(updatePassword(req)).rejects.toThrow('User not found');
    });

    it('should handle database query errors', async () => {
        mockClient.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(updatePassword(req)).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
});
