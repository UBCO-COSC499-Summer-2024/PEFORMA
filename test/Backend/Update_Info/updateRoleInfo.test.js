const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { updateRoleInfo } = require('../../../app/backend/services/UpdateInfo/updateRoleInfo');
const pool = require('../../../app/backend/db/index');

jest.mock('../../../app/backend/db/index');

describe('updateRoleInfo', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                roleName: 'New Role Name',
                roleDescription: 'New Role Description',
                isActive: true,
                department: 'Computer Science',
                roleID: 1
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the role information', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const result = await updateRoleInfo(req);

        const expectedData = [
            'New Role Name',
            'New Role Description',
            true,
            1, // divisionid for "Computer Science"
            1 // roleID
        ];

        const expectedQuery = `
    UPDATE "ServiceRole"
    SET "stitle" = $1,
    "description" = $2,
    "isActive" = $3,
    "divisionId" = $4
    WHERE "serviceRoleId" = $5
    `;

        expect(pool.query).toHaveBeenCalledWith(expectedQuery, expectedData);
        expect(result).toEqual({ rowCount: 1 });
    });

    it('should handle database query errors', async () => {
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(updateRoleInfo(req)).rejects.toThrow('Test error');
    });
});
