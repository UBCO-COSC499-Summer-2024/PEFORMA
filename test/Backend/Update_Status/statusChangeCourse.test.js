const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getStatusChangeCourse } = require('../../../app/backend/services/UpdateStatus/statusChangeCourse');
const pool = require('../../../app/backend/db/index');
const { getAllCourses } = require('../../../app/backend/services/ShowList/allCoursesService');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/ShowList/allCoursesService');
jest.mock('../../../app/backend/services/latestTerm.js');

describe('getStatusChangeCourse', () => {
    beforeEach(() => {
        pool.query.mockClear();
        getAllCourses.mockClear();
        getLatestTerm.mockClear();
    });

    it('should insert a new course by term if status is true', async () => {
        const req = {
            body: {
                courseid: 1,
                newStatus: true
            }
        };

        getLatestTerm.mockResolvedValue('2024');
        pool.query.mockResolvedValueOnce();
        getAllCourses.mockResolvedValue([
            { courseId: 1, courseName: 'Course 1' },
            { courseId: 2, courseName: 'Course 2' }
        ]);

        const result = await getStatusChangeCourse(req);

        expect(result).toEqual([
            { courseId: 1, courseName: 'Course 1' },
            { courseId: 2, courseName: 'Course 2' }
        ]);
    });

    it('should delete course data if status is false', async () => {
        const req = {
            body: {
                courseid: 1,
                newStatus: false
            }
        };

        getLatestTerm.mockResolvedValue('2024');
        pool.query.mockResolvedValueOnce();
        getAllCourses.mockResolvedValue([
            { courseId: 1, courseName: 'Course 1' },
            { courseId: 2, courseName: 'Course 2' }
        ]);

        const result = await getStatusChangeCourse(req);

        expect(result).toEqual([
            { courseId: 1, courseName: 'Course 1' },
            { courseId: 2, courseName: 'Course 2' }
        ]);
    });

    it('should throw an error if getLatestTerm fails', async () => {
        const req = {
            body: {
                courseid: 1,
                newStatus: true
            }
        };

        getLatestTerm.mockRejectedValue(new Error('Failed to get latest term'));

        await expect(getStatusChangeCourse(req)).rejects.toThrow('Failed to get latest term');
    });

    it('should throw an error if pool.query fails during insertion', async () => {
        const req = {
            body: {
                courseid: 1,
                newStatus: true
            }
        };

        getLatestTerm.mockResolvedValue('2024');
        pool.query.mockRejectedValueOnce(new Error('Database query failed'));

        await expect(getStatusChangeCourse(req)).rejects.toThrow('Error updating course status.');
    });

    it('should throw an error if pool.query fails during deletion', async () => {
        const req = {
            body: {
                courseid: 1,
                newStatus: false
            }
        };

        getLatestTerm.mockResolvedValue('2024');
        pool.query.mockResolvedValueOnce();
        pool.query.mockRejectedValueOnce(new Error('Database query failed'));

        await expect(getStatusChangeCourse(req)).rejects.toThrow('Error updating course status.');
    });
});
