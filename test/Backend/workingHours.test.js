const { getWorkingHours } = require('../../app/backend/controllers/workingHoursController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getWorkingHours', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return working hours for each month up to the current month', async () => {
        const req = {
            query: { profileId: '123', currentMonth: '6' }
        };
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        // Setup mock data for the database responses
        pool.query
            .mockResolvedValueOnce({ rows: [{ year: '2022' }] }) // Mock for the year query
            .mockResolvedValueOnce({ // Mock for the service role assignment and working hours
                rows: [
                    { JANHour: 50, FEBHour: 40, MARHour: 30, APRHour: 20, MAYHour: 10, JUNHour: 0, JULHour: 0, AUGHour: 0, SEPHour: 0, OCTHour: 0, NOVHour: 0, DECHour: 0 }
                ]
            });

        await getWorkingHours(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(jsonFn).toHaveBeenCalledWith({
            data: [
                { x: 'September', y: 0 },
                { x: 'October', y: 0 },
                { x: 'November', y: 0 },
                { x: 'December', y: 0 },
                { x: 'January', y: 50 },
                { x: 'February', y: 40 },
                { x: 'March', y: 30 },
                { x: 'April', y: 20 },
                { x: 'May', y: 10 },
                { x: 'June', y: 0 }
            ]
        });
    });

    it('should handle no data found for the specified profile ID', async () => {
        const req = {
            query: { profileId: '123', currentMonth: '6' }
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Mock no year data found and then no service role data found
        pool.query
            .mockResolvedValueOnce({ rows: [{ year: '2022' }] })
            .mockResolvedValueOnce({ rows: [] });

        await getWorkingHours(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle database errors gracefully', async () => {
        const req = {
            query: { profileId: '123', currentMonth: '6' }
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Mock a database error on the initial year query
        pool.query.mockRejectedValueOnce(new Error('Database query error'));

        await getWorkingHours(req, res);

        expect(pool.query).toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database query error' });
    });
});
