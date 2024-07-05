
const { getCourseHistory } = require('../../app/backend/controllers/courseHistoryController');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index', () => ({
    query: jest.fn()
}));

describe('getCourseHistory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('successfully retrieves course history', async () => {
        const req = {
            query: { courseId: '1' }
        };
        const jsonFn = jest.fn();
        const res = { json: jsonFn, status: jest.fn().mockReturnThis() };

        // Mock database responses
        pool.query.mockResolvedValueOnce({ // Mock course data
            rows: [{
                term: '202301',
                full_name: 'John Doe',
                ctitle: 'Course Title',
                description: 'Course Description',
                courseCode: 'CS 101',
                score: 85,
                dname: 'Computer Science',
                profileId: '123'
            }]
        }).mockResolvedValueOnce({ // Mock average score
            rows: [{ avgScore: 84.5 }]
        }).mockResolvedValueOnce({ // Mock score data
            rows: [{ score: 85 }]
        });

        await getCourseHistory(req, res);

        expect(pool.query).toHaveBeenCalledTimes(3);
        expect(jsonFn).toHaveBeenCalledWith(expect.objectContaining({
            courseName: 'Course Title',
            courseDescription: 'Course Description',
            division: 'Computer Science',
            avgScore: 85, // Rounded
            history: expect.arrayContaining([
                expect.objectContaining({
                    instructorName: 'John Doe',
                    session: '2023W',
                    score: 85
                })
            ])
        }));
    });

    it('returns a 404 if no course data is found', async () => {
        const req = { query: { courseId: '1' } };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Mock no course data found
        pool.query.mockResolvedValueOnce({ rows: [] });

        await getCourseHistory(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(statusFn).toHaveBeenCalledWith(404);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('handles database errors gracefully', async () => {
        const req = { query: { courseId: '1' } };
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnThis();
        const res = { json: jsonFn, status: statusFn };

        // Mock a database error
        pool.query.mockRejectedValue(new Error('Database query error'));

        await getCourseHistory(req, res);

        expect(pool.query).toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Database query error' });
    });
});
