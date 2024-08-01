const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


const { getLatestTerm } = require('../../app/backend/services/latestTerm.js');
const pool = require('../../app/backend/db/index.js');

jest.mock('../../app/backend/db/index.js');

describe('getLatestTerm', () => {
    let mockClient;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(),
        };
        pool.query = mockClient.query;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the latest term', async () => {
        const mockResult = { rows: [{ curTerm: '202301' }] };
        mockClient.query.mockResolvedValueOnce(mockResult);

        const result = await getLatestTerm();

        expect(mockClient.query).toHaveBeenCalledWith(
            `SELECT "curTerm" FROM "CurrentTerm" LIMIT 1;`
        );
        expect(result).toEqual(mockResult.rows[0].curTerm);
    });

    it('should throw an error if the query fails', async () => {
        mockClient.query.mockRejectedValueOnce(new Error('Test error'));

        await expect(getLatestTerm()).rejects.toThrow('Test error');
    });
});
