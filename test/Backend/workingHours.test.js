const { getWorkingHours } = require('../../app/backend/controllers/workingHoursController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getWorkingHours', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return correctly formatted working hours up to the specified month minus one', async () => {
        const req = {
            query: { profileId: '123', currentMonth: '12' } //  November data should be shown
        };
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        pool.query
            .mockResolvedValueOnce({ rows: [{ year: '2023' }] }) // Mock for the year query
            .mockResolvedValueOnce({ // Mock for the working hours data
                rows: [
                    { JANHour: 100, FEBHour: 90, MARHour: 80, APRHour: 70, MAYHour: 60, JUNHour: 50, JULHour: 40, AUGHour: 30, SEPHour: 20, OCTHour: 10, NOVHour: 5, DECHour: 0 }
                ]
            });

        await getWorkingHours(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(jsonFn).toHaveBeenCalledWith({
            data: [
                { x: "September", y: 20 },
                { x: "October", y: 10 },
                { x: "November", y: 5 }
            ]
        });
    });

    it('should handle no data found for the specified profile ID', async () => {
        const req = {
            query: { profileId: '123', currentMonth: '1' } // December data should not be shown
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query
            .mockResolvedValueOnce({ rows: [{ year: '2023' }] }) // Year found but no subsequent data
            .mockResolvedValueOnce({ rows: [] });

        await getWorkingHours(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle database errors gracefully', async () => {
        const req = {
            query: { profileId: '123', currentMonth: '12' } // Data till November should be considered
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query.mockRejectedValueOnce(new Error('Database query error')); // Error on the first query

        await getWorkingHours(req, res);

        expect(pool.query).toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database query error' });
    });
});
