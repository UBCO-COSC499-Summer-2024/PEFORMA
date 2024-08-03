const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { assignServiceRole } = require('../../../app/backend/services/AssignInstructor/assignServiceRole');
const pool = require('../../../app/backend/db/index');

jest.mock('../../../app/backend/db/index');

describe('assignServiceRole', () => {
    beforeEach(() => {
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should assign the service role to the profile if the role exists', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ stitle: 'Role Title' }] }); // All roles query
        pool.query.mockResolvedValueOnce({ rows: [{ serviceRoleId: 1 }] }); // Role query
        pool.query.mockResolvedValueOnce({ rows: [{ profileId: 123, serviceRoleId: 1, year: '2023' }] }); // Insert query

        const result = await assignServiceRole(123, 'Role Title', '2023', 1);

        expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String));
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.any(String), ['Role Title', 1]);
        expect(pool.query).toHaveBeenNthCalledWith(3, expect.any(String), [123, 1, '2023']);
        expect(result).toEqual([{ profileId: 123, serviceRoleId: 1, year: '2023' }]);
    });

    it('should throw an error if the role does not exist', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ stitle: 'Role Title' }] });
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(assignServiceRole(123, 'Nonexistent Role', '2023', 1)).rejects.toThrow('No role found');
    });
});
