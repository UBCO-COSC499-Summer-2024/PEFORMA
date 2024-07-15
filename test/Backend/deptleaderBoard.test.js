const { getDeptLeaderBoard } = require('../../app/backend/controllers/deptLeaderBoardController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getDeptLeaderBoard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return top and bottom department leaderboards correctly', async () => {
        const req = {};
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        // Setup mock data response for the term, top performers, and bottom performers queries
        pool.query.mockResolvedValueOnce({ rows: [{ term: '2022' }] }) // Mock for the term query
                   .mockResolvedValueOnce({ // Mock for the top performers query
                       rows: [
                           { full_name: 'John Doe', average_score: 95.5 },
                           { full_name: 'Jane Doe', average_score: 91.2 }
                       ]
                   }).mockResolvedValueOnce({ // Mock for the bottom performers query
                       rows: [
                           { full_name: 'Jim Beam', average_score: 65.0 },
                           { full_name: 'Jack Daniels', average_score: 60.5 }
                       ]
                   });

        await getDeptLeaderBoard(req, res);

        expect(pool.query).toHaveBeenCalledTimes(3);
        expect(jsonFn).toHaveBeenCalledWith({
            top: [
                { name: 'John Doe', score: 95.5 },
                { name: 'Jane Doe', score: 91.2 }
            ],
            bottom: [
                { name: 'Jim Beam', score: 65.0 },
                { name: 'Jack Daniels', score: 60.5 }
            ]
        });
    });

    it('should handle no terms found with a 404 response', async () => {
        const req = {};
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Mock no terms found
        pool.query.mockResolvedValueOnce({ rows: [] });

        await getDeptLeaderBoard(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'No performance data found.' });
    });

    it('should handle no data found after retrieving a term', async () => {
        const req = {};
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Mock term found but no data for top or bottom performers
        pool.query.mockResolvedValueOnce({ rows: [{ term: '2022' }] })
                  .mockResolvedValueOnce({ rows: [] }) // Top performers
                  .mockResolvedValueOnce({ rows: [] }); // Bottom performers

        await getDeptLeaderBoard(req, res);

        expect(pool.query).toHaveBeenCalledTimes(3);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'No performance data found.' });
    });

    it('should handle database errors gracefully', async () => {
        const req = {};
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Mock a database error
        pool.query.mockRejectedValueOnce(new Error('Database query error'));

        await getDeptLeaderBoard(req, res);

        expect(pool.query).toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database query error' });
    });
});
