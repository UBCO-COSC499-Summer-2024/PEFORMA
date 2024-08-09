const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getAllServiceRoles } = require('../../../app/backend/services/ShowList/serviceRoleService');
const pool = require('../../../app/backend/db/index');
const { updateAllServiceRoles } = require('../../../app/backend/services/UpdateStatus/updateAllServiceRoles');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/UpdateStatus/updateAllServiceRoles');
jest.mock('../../../app/backend/services/latestTerm');

describe('getAllServiceRoles', () => {
    beforeEach(() => {
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all service roles', async () => {
        updateAllServiceRoles.mockResolvedValueOnce();
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query
            .mockResolvedValueOnce({ rows: [{ count: '5' }] }) // countResult
            .mockResolvedValueOnce({
                rows: [
                    {
                        id: 1,
                        name: 'Role 1',
                        department: 'Dept 1',
                        description: 'Desc 1',
                        isActive: true
                    },
                    {
                        id: 2,
                        name: 'Role 2',
                        department: 'Dept 2',
                        description: 'Desc 2',
                        isActive: false
                    }
                ]
            });

        const result = await getAllServiceRoles();

        expect(updateAllServiceRoles).toHaveBeenCalled();
        expect(getLatestTerm).toHaveBeenCalled();
        expect(result).toEqual({
            currentPage: 1,
            perPage: 10,
            currentTerm: '202301',
            rolesCount: 5,
            roles: [
                {
                    id: 1,
                    name: 'Role 1',
                    department: 'Dept 1',
                    description: 'Desc 1',
                    status: true
                },
                {
                    id: 2,
                    name: 'Role 2',
                    department: 'Dept 2',
                    description: 'Desc 2',
                    status: false
                }
            ]
        });
    });

    it('should handle database query errors', async () => {
        updateAllServiceRoles.mockResolvedValueOnce();
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        await expect(getAllServiceRoles()).rejects.toThrow('Test error');
    });
});
