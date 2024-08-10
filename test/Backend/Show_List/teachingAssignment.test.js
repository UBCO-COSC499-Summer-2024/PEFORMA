const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getTeachingAssignment } = require('../../../app/backend/services/ShowList/teachingAssignment');
const pool = require('../../../app/backend/db/index');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/latestTerm');

describe('getTeachingAssignment', () => {
    beforeEach(() => {
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return teaching assignments', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query
            .mockResolvedValueOnce({
                rows: [
                    {
                        profileId: 1,
                        full_name: 'John Doe',
                        UBCId: '12345678',
                        department_name: 'Dept 1',
                        email: 'john.doe@example.com',
                        courseid: [1, 2]
                    },
                    {
                        profileId: 2,
                        full_name: 'Jane Smith',
                        UBCId: '87654321',
                        department_name: 'Dept 2',
                        email: 'jane.smith@example.com',
                        courseid: [3]
                    }
                ],
                rowCount: 2
            })
            .mockResolvedValueOnce({
                rows: [
                    {
                        coursename: 'Course 1',
                        ctitle: 'Course Title 1',
                        courseId: 1
                    },
                    {
                        coursename: 'Course 2',
                        ctitle: 'Course Title 2',
                        courseId: 2
                    }
                ]
            })
            .mockResolvedValueOnce({
                rows: [
                    {
                        coursename: 'Course 3',
                        ctitle: 'Course Title 3',
                        courseId: 3
                    }
                ]
            });

        const result = await getTeachingAssignment();

        expect(getLatestTerm).toHaveBeenCalled();
        expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), ['202301']);
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.any(String), [[1, 2]]);
        expect(pool.query).toHaveBeenNthCalledWith(3, expect.any(String), [[3]]);

        expect(result).toEqual({
            currentTerm: '202301',
            currentPage: 1,
            divisionCoursesCount: 2,
            teachinginfo: [
                {
                    instructor: 'John Doe',
                    ubcid: '12345678',
                    division: 'Dept 1',
                    courses: ['Course 1', 'Course 2'],
                    courseName: ['Course Title 1', 'Course Title 2'],
                    courseid: [1, 2],
                    email: 'john.doe@example.com'
                },
                {
                    instructor: 'Jane Smith',
                    ubcid: '87654321',
                    division: 'Dept 2',
                    courses: ['Course 3'],
                    courseName: ['Course Title 3'],
                    courseid: [3],
                    email: 'jane.smith@example.com'
                }
            ]
        });
    });

    it('should handle database query errors', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        await expect(getTeachingAssignment()).rejects.toThrow('Test error');
    });
});
