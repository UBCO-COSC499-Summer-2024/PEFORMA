const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { removeInstructorCourse } = require('../../../app/backend/services/RemoveInstructor/removeInstructorCourse');
const pool = require('../../../app/backend/db/index');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/latestTerm');

describe('removeInstructorCourse', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                profileId: 1,
                courseId: 101
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should remove the instructor from the course if the entry exists', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const result = await removeInstructorCourse(req);

        expect(getLatestTerm).toHaveBeenCalled();
        expect(pool.query).toHaveBeenCalledWith(
            'DELETE FROM "InstructorTeachingAssignment" WHERE "profileId" = $1 AND "courseId" = $2 AND "term" = $3 RETURNING *',
            [1, 101, '202301']
        );
        expect(result).toBe(true);
    });

    it('should throw an error if no matching entry is found', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        await expect(removeInstructorCourse(req)).rejects.toThrow('No matching entry found to delete');
    });

    it('should handle database query errors', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(removeInstructorCourse(req)).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith('Error removing instructor:', expect.any(Error));
    });
});
