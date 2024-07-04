const { getDepartPerformance } = require('../../app/backend/controllers/deptPerformanceController');
const pool = require('../../app/backend/db/index');

// Mocking the database pool
jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getDepartPerformance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the latest department performance data correctly', async () => {
        const req = {
            params: {},
            body: {}
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn(() => ({ json: jsonFn }));
        const res = { json: jsonFn, status: statusFn };

        // Mocking the database query responses
        pool.query.mockResolvedValueOnce({
            rows: [{ term: '2022' }] // Mock the response for the term query
        }).mockResolvedValueOnce({
            rows: [ // Mock the response for the performance data query
                { divisionId: 1, average_score: 80.5 },
                { divisionId: 2, average_score: 75.0 },
                { divisionId: 3, average_score: 68.4 },
                { divisionId: 4, average_score: 90.2 }
            ]
        });

        await getDepartPerformance(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(res.json).toHaveBeenCalledWith({
            series: [80.5, 75.0, 68.4, 90.2],
            labels: ["Computer Science", "Mathematics", "Physics", "Statistics"]
        });
    });

    it('should handle no performance data found for the term', async () => {
        const req = { params: {}, body: {} };
        const jsonFn = jest.fn();
        const statusFn = jest.fn(() => ({ json: jsonFn }));
        const res = { json: jsonFn, status: statusFn };

        // Mock no data found for the term query
        pool.query.mockResolvedValueOnce({ rows: [] });

        await getDepartPerformance(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1); // Only the term query is made
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status().json).toHaveBeenCalledWith({ message: 'No performance data found.' });
    });
});
