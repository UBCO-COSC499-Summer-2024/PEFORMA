const { getBenchmark } = require('../../app/backend/controllers/benchmarkController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getBenchmark', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockDate = (month) => {
        const baseTime = new Date(2022, month - 1, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => baseTime);
    };

    it.each([
        { month: 10, expectedCalls: 2, profileData: { profileId: 1, full_name: 'John Doe', sRoleBenchmark: 100, total_hours: 50 } },
        { month: 11, expectedCalls: 2, profileData: { profileId: 2, full_name: 'Jane Smith', sRoleBenchmark: 300, total_hours: 290 } },
        { month: 12, expectedCalls: 2, profileData: { profileId: 3, full_name: 'Alice Johnson', sRoleBenchmark: 200, total_hours: 210 } }
    ])('should calculate hour shortages correctly for month $month', async ({ month, expectedCalls, profileData }) => {
        mockDate(month);
        const req = {};
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        pool.query.mockResolvedValueOnce({ rows: [{ year: '2022' }] })
                   .mockResolvedValueOnce({ rows: [profileData] });

        await getBenchmark(req, res);

        expect(pool.query).toHaveBeenCalledTimes(expectedCalls);
        expect(jsonFn).toHaveBeenCalledWith(expect.anything());
    });

    it('should handle no year data found', async () => {
        mockDate(10); // October 
        const req = {};
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        pool.query.mockResolvedValueOnce({ rows: [] });

        await getBenchmark(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'No year data found.' });
    });

    it('should handle database errors gracefully', async () => {
        mockDate(10);
        const req = {};
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await getBenchmark(req, res);

        expect(pool.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database error' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});
