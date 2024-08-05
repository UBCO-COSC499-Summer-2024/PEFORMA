const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { instructorFetch } = require('../../../app/backend/services/AssignInstructor/instructorFetch');
const pool = require('../../../app/backend/db/index');
const { expect } = require('chai');

jest.mock('../../../app/backend/db/index');

describe('instructorFetch', () => {
    beforeEach(() => {
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of instructors with the correct structure', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [
                { profileId: 1, id: '12345678', name: 'John Doe' },
                { profileId: 2, id: '87654321', name: 'Jane Smith' }
            ],
            rowCount: 2
        });
        const expectedOutput = {
            instructors: [
                { profileId: 1, id: '12345678', name: 'John Doe' },
                { profileId: 2, id: '87654321', name: 'Jane Smith' }
            ],
            instructorCount: 2,
            perPage: 8,
            currentPage: 1
        };
        const result = await instructorFetch();
        expect(result===expectedOutput);
    });

    it('should handle database query errors', async () => {
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();
        let catch_error = false;
        try{
        const result = await instructorFetch();
        }catch(error){
            catch_error=true;
        }
        expect(catch_error=true);
    });

});
