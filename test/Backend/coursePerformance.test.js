const { getCoursePerformance } = require('../../app/backend/controllers/coursePerformanceController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getCoursePerformance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return course performance data correctly', async () => {
        const req = {
            query: { divisionId: '1' } 
        };
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        
        pool.query.mockResolvedValueOnce({ rows: [{ term: '2022' }] }) // Mock for the term query
                   .mockResolvedValueOnce({ rows: [ // Mock for the course performance query
                        { DivisionAndCourse: 'CS 101', score: 85 },
                        { DivisionAndCourse: 'CS 102', score: 75 }
                    ] });

        await getCoursePerformance(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(jsonFn).toHaveBeenCalledWith({
            courses: [
                { courseCode: 'CS 101', rank: 'B', score: '85.00' },
                { courseCode: 'CS 102', rank: 'C', score: '75.00' }
            ]
        });
    });

    it('should return a 404 error if no terms are found', async () => {
        const req = {
            query: { divisionId: '1' }
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query.mockResolvedValueOnce({ rows: [] }); // No terms found

        await getCoursePerformance(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Term not found' });
    });

    it('should handle database errors gracefully', async () => {
        const req = {
            query: { divisionId: '1' }
        };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query.mockRejectedValueOnce(new Error('Database query error')); // Database error

        await getCoursePerformance(req, res);

        expect(pool.query).toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database query error' });
    });
});
