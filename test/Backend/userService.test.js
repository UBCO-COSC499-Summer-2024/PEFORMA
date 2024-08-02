const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getUserById } = require('../../app/backend/services/userService');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index');

describe('getUserById', () => {
    let profileId;

    beforeEach(() => {
        profileId = 1;
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user information by profileId', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ firstName: 'John', lastName: 'Doe' }]
        });

        const result = await getUserById(profileId);

        expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
    });

    it('should handle database query errors', async () => {
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(getUserById(profileId)).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith('Error in getUserById service:', expect.any(Error));
    });
});
