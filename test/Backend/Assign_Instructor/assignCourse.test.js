const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { assignCourse } = require('../../../app/backend/services/AssignInstructor/assignCourse');
const pool = require('../../../app/backend/db/index');


jest.mock('../../../app/backend/db/index');

describe('assignCourse', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                courseId: 1,
                term: '202301',
                profileId: 123
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should assign the instructor to the course if the course and term exist', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{}] }); // Check course term query
        pool.query.mockResolvedValueOnce({ rows: [{ profileId: 123, courseId: 1, term: '202301' }] }); // Insert query

        const result = await assignCourse(req);

        expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), [1, '202301']);
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.any(String), [123, 1, '202301']);
        expect(result).toEqual({ profileId: 123, courseId: 1, term: '202301' });
    });

    it('should throw an error if the course and term do not exist', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(assignCourse(req)).rejects.toThrow('Create course for this term first');
    });

    it('should throw an error if the assignment already exists or could not be created', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{}] });
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(assignCourse(req)).rejects.toThrow('Assignment already exists or could not be created');
    });
});
