const { getProgress } = require('../../app/backend/controllers/progressController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getProgress', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate progress correctly', async () => {
        const req = {
            query: {
                profileId: '1',
                currentMonth: '10'
            }
        };
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        // Mock database responses
        pool.query
            .mockResolvedValueOnce({ rows: [{ year: '2022' }] }) // Fetch latest year
            .mockResolvedValueOnce({ // Fetch service role hours
                rows: [
                    { JANHour: 10, FEBHour: 20, MARHour: 30, APRHour: 40, MAYHour: 50, JUNHour: 60, JULHour: 70, AUGHour: 80, SEPHour: 90, OCTHour: 100, NOVHour: 110, DECHour: 120 }
                ]
            })
            .mockResolvedValueOnce({ rows: [{ sRoleBenchmark: 300 }] }); // Fetch benchmark

        await getProgress(req, res);

        expect(jsonFn).toHaveBeenCalledWith({
            series: [33] // Expected progress rate for October
        });
    });

    it('should return 404 when no year data found', async () => {
        const req = {
            query: {
                profileId: '1',
                currentMonth: '10'
            }
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // No year data found
        pool.query.mockResolvedValueOnce({ rows: [] });

        await getProgress(req, res);

        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'No performance data found.' });
    });

    it('should return 404 when user not found during hour calculation', async () => {
        const req = {
            query: {
                profileId: '1',
                currentMonth: '10'
            }
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Year found but no user data
        pool.query.mockResolvedValueOnce({ rows: [{ year: '2022' }] })
                  .mockResolvedValueOnce({ rows: [] });

        await getProgress(req, res);

        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('handles database errors gracefully', async () => {
        const req = {
            query: {
                profileId: '1',
                currentMonth: '10'
            }
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Simulate a database error
        pool.query.mockRejectedValueOnce(new Error('Database query error'));

        await getProgress(req, res);

        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database query error' });
    });
});
