const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getStatusChangeServiceRole } = require('../../../app/backend/services/UpdateStatus/statusChangeServiceRole');
const pool = require('../../../app/backend/db/index');
const { getAllServiceRoles } = require('../../../app/backend/services/ShowList/serviceRoleService');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/ShowList/serviceRoleService');

describe('getStatusChangeServiceRole', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                roleId: 1,
                newStatus: true
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the status of the service role and return all service roles', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ serviceRoleId: 1, isActive: true }] });
        getAllServiceRoles.mockResolvedValueOnce('all service roles data');

        const result = await getStatusChangeServiceRole(req);

        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE "ServiceRole" SET "isActive" = $1 WHERE "serviceRoleId" = $2 RETURNING *;',
            [true, 1]
        );
        expect(getAllServiceRoles).toHaveBeenCalled();
        expect(result).toBe('all service roles data');
    });

    it('should throw an error if no service role data is found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(getStatusChangeServiceRole(req)).rejects.toThrow('No service role data found');
    });

    it('should handle database query errors', async () => {
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        await expect(getStatusChangeServiceRole(req)).rejects.toThrow('Test error');
    });
});
