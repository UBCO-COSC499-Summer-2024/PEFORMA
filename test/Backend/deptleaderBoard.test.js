const { getDeptLeaderBoard } = require('../../app/backend/controllers/deptLeaderBoardController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getDeptLeaderBoard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('handles database errors gracefully', async () => {
        const req = {};
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Simulate a database error during the first query (fetching term)
        pool.query.mockRejectedValueOnce(new Error('Database query error'));

        await getDeptLeaderBoard(req, res);

        // Check if the error handling is correct, expecting a 500 status code
        expect(pool.query).toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database query error' });
    });

    // Additional tests to ensure the overall functionality
    it('correctly returns the top and bottom performers', async () => {
        const req = {};
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        // Mock data response for the term, top performers, and bottom performers queries
        pool.query.mockResolvedValueOnce({ rows: [{ term: '2022' }] }) // Fetch latest term
               .mockResolvedValueOnce({ // Fetch top performers
                   rows: [
                       { full_name: 'John Doe', average_score: 95.5 },
                       { full_name: 'Jane Doe', average_score: 91.2 }
                   ]
               }).mockResolvedValueOnce({ // Fetch bottom performers
                   rows: [
                       { full_name: 'Jim Beam', average_score: 65.0 },
                       { full_name: 'Jack Daniels', average_score: 60.5 }
                   ]
               });

        await getDeptLeaderBoard(req, res);

        expect(pool.query).toHaveBeenCalledTimes(3);
        expect(jsonFn).toHaveBeenCalledWith({
            top: [
                { name: 'John Doe', score: '95.5' },
                { name: 'Jane Doe', score: '91.2' }
            ],
            bottom: [
                { name: 'Jim Beam', score: '65.0' },
                { name: 'Jack Daniels', score: '60.5' }
            ]
        });
    });

    it('returns a 404 when no data is found for the latest term', async () => {
        const req = {};
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        pool.query.mockResolvedValueOnce({ rows: [{ term: '2022' }] }) // Fetch latest term
                  .mockResolvedValueOnce({ rows: [] }) // No top performers found
                  .mockResolvedValueOnce({ rows: [] }); // No bottom performers found

        await getDeptLeaderBoard(req, res);

        expect(pool.query).toHaveBeenCalledTimes(3);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'No performance data found.' });
    });
});
