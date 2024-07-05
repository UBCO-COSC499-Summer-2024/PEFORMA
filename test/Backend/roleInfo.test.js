const { getRoleInfo } = require('../../app/backend/controllers/roleInfoController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getRoleInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('successfully retrieves role information', async () => {
        const req = {
            query: { serviceRoleId: '1' }
        };
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        // Mock database responses
        pool.query.mockResolvedValueOnce({ rows: [{ year: '2023' }] }) // Mock finding the year
                 .mockResolvedValueOnce({ // Mock finding role information
                     rows: [{
                         stitle: 'Role Title',
                         description: 'Role Description',
                         dname: 'Department Name',
                         UBCId: '12345',
                         full_name: 'John Doe'
                     }]
                 })
                 .mockResolvedValueOnce({ // Mock calculating benchmark
                     rows: [{ total_hours: 120 }]
                 });

        await getRoleInfo(req, res);

        expect(pool.query).toHaveBeenCalledTimes(3);
        expect(jsonFn).toHaveBeenCalledWith(expect.objectContaining({
            roleName: 'Role Title',
            roleDescription: 'Role Description',
            department: 'Department Name',
            benchmark: 10, // Checks if the benchmark calculation is correct
            assignees: expect.arrayContaining([expect.objectContaining({
                name: 'John Doe'
            })])
        }));
    });

    it('returns a 404 if no year is found', async () => {
        const req = { query: { serviceRoleId: '1' } };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query.mockResolvedValueOnce({ rows: [] }); // Mock no year found

        await getRoleInfo(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Service role not found' });
    });

    it('returns a 404 if no role information is found after finding a year', async () => {
        const req = { query: { serviceRoleId: '1' } };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query.mockResolvedValueOnce({ rows: [{ year: '2023' }] }) // Mock finding the year
                 .mockResolvedValueOnce({ rows: [] }); // Mock no role information found

        await getRoleInfo(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'No users found for the specified role' });
    });

    it('handles database errors gracefully', async () => {
        const req = { query: { serviceRoleId: '1' } };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query.mockRejectedValue(new Error('Database query error'));

        await getRoleInfo(req, res);

        expect(pool.query).toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Server error during fetching profile' });
    });
});
