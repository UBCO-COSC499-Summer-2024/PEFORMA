const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getLatestYear } = require('../../app/backend/services/latestYear.js');
const { getLatestTerm } = require('../../app/backend/services/latestTerm.js');

jest.mock('../../app/backend/services/latestTerm.js');

describe('getLatestYear', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the latest year from the latest term', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');

        const result = await getLatestYear();

        expect(getLatestTerm).toHaveBeenCalled();
        expect(result).toBe('2023');
    });

    it('should throw an error if getLatestTerm fails', async () => {
        getLatestTerm.mockRejectedValueOnce(new Error('Test error'));

        await expect(getLatestYear()).rejects.toThrow('Test error');
    });
});
