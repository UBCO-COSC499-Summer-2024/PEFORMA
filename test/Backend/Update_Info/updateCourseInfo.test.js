const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { updateCourseInfo } = require('../../../app/backend/services/UpdateInfo/updateCourseInfo');
const pool = require('../../../app/backend/db/index');

jest.mock('../../../app/backend/db/index');

describe('updateCourseInfo', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                courseId: 1,
                courseDescription: 'Updated course description'
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the course information', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const result = await updateCourseInfo(req);

        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE "Course" SET "description" = $1 WHERE "courseId" = $2',
            ['Updated course description', 1]
        );
        expect(result).toBe(true);
    });

    it('should handle database query errors', async () => {
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(updateCourseInfo(req)).rejects.toThrow('Test error');
    });
});
