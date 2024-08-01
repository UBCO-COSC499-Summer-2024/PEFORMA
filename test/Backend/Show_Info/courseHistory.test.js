const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getCourseHistory } = require('../../../app/backend/services/ShowInfo/courseHistory');
const pool = require('../../../app/backend/db/index');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/latestTerm');

describe('getCourseHistory', () => {
    let req;

    beforeEach(() => {
        req = {
            query: {
                courseId: 1
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the course history if the course exists', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query
            .mockResolvedValueOnce({
                rows: [{
                    ctitle: 'Course Title',
                    description: 'Course Description',
                    courseCode: 'CS101',
                    dname: 'Computer Science'
                }]
            }) // First query
            .mockResolvedValueOnce({
                rows: [
                    {
                        term: '202201',
                        full_name: 'John Doe',
                        score: 4.5,
                        profileId: 1,
                        UBCId: '12345678'
                    },
                    {
                        term: '202202',
                        full_name: 'Jane Smith',
                        score: 4.0,
                        profileId: 2,
                        UBCId: '87654321'
                    }
                ]
            }) // Second query
            .mockResolvedValueOnce({
                rows: [{
                    avgScore: 4.25
                }]
            }); // Third query

        const result = await getCourseHistory(req);

        expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), [1]);
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.any(String), [1, '202301']);
        expect(pool.query).toHaveBeenNthCalledWith(3, expect.any(String), [1]);

        expect(result).toEqual({
            currentPage: 1,
            perPage: 10,
            courseID: 1,
            entryCount: 2,
            courseCode: 'CS101',
            latestTerm: '202301',
            courseName: 'Course Title',
            courseDescription: 'Course Description',
            division: 'Computer Science',
            avgScore: 4,
            history: [
                {
                    instructorID: 1,
                    instructorName: 'John Doe',
                    session: '2022W',
                    term: '1',
                    score: 4.5,
                    term_num: '202201',
                    ubcid: '12345678'
                },
                {
                    instructorID: 2,
                    instructorName: 'Jane Smith',
                    session: '2022W',
                    term: '2',
                    score: 4.0,
                    term_num: '202202',
                    ubcid: '87654321'
                }
            ]
        });
    });

    it('should throw an error if no course details are found', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(getCourseHistory(req)).rejects.toThrow();
    });

    it('should handle database query errors', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(getCourseHistory(req)).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith('Database query error:', expect.any(Error));
    });
});
