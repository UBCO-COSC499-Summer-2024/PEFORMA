const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getStatusChangeCourse } = require('../../../app/backend/services/UpdateStatus/statusChangeCourse');
const pool = require('../../../app/backend/db/index');
const { getAllCourses } = require('../../../app/backend/services/ShowList/allCoursesService');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/ShowList/allCoursesService');

describe('getStatusChangeCourse', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                courseid: 1,
                newStatus: true
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the status of the course and return all courses', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ courseId: 1, isActive: true }] });
        getAllCourses.mockResolvedValueOnce('all courses data');

        const result = await getStatusChangeCourse(req);

        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE "Course" SET "isActive" = $1 WHERE "courseId" = $2 RETURNING *;',
            [true, 1]
        );
        expect(getAllCourses).toHaveBeenCalled();
        expect(result).toBe('all courses data');
    });

    it('should throw an error if no course data is found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(getStatusChangeCourse(req)).rejects.toThrow('No course data found');
    });

    it('should handle database query errors', async () => {
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        await expect(getStatusChangeCourse(req)).rejects.toThrow('Test error');
    });
});
