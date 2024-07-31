const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { removeInstructorRole } = require('../../../app/backend/services/RemoveInstructor/removeInstructorRole');
const pool = require('../../../app/backend/db/index');
const { getLatestYear } = require('../../../app/backend/services/latestYear');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/latestYear');

describe('removeInstructorRole', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                serviceRoleId: 1,
                id: '12345678'
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should remove the instructor from the role if the entry exists', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ profileId: 1 }] }); // Profile query
        pool.query.mockResolvedValueOnce({ rowCount: 1 }); // Delete query

        const result = await removeInstructorRole(req);

        expect(getLatestYear).toHaveBeenCalled();
        expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT "profileId" FROM "Profile" WHERE "UBCId" = $1', ['12345678']);
        expect(pool.query).toHaveBeenNthCalledWith(2, 
            'DELETE FROM "ServiceRoleAssignment" WHERE "profileId" = $1 AND "serviceRoleId" = $2 AND "year" = $3 RETURNING *',
            [1, 1, '2023']
        );
        expect(result).toBe(true);
    });

    it('should throw an error if the instructor is not found', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

        await expect(removeInstructorRole(req)).rejects.toThrow('Instructor not found for 12345678');
    });

    it('should throw an error if no assignment is found for the year', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ profileId: 1 }] }); // Profile query
        pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // Delete query

        await expect(removeInstructorRole(req)).rejects.toThrow('No assignment found for this year');
    });

    it('should handle database query errors', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(removeInstructorRole(req)).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith('Error removing instructor:', expect.any(Error));
    });
});
