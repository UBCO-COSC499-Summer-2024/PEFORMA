const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getImageById } = require('../../../app/backend/services/ShowInfo/imageService.js');
const pool = require('../../../app/backend/db/index.js');

jest.mock('../../../app/backend/db/index.js');

describe('getImageById', () => {
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

    it('should return the image data and file type for a given profile ID', async () => {
        const mockResult = { rows: [{ file_type: 'image/png', image_data: 'some_image_data' }] };
        mockClient.query.mockResolvedValueOnce(mockResult);

        const result = await getImageById(123);
  
        expect(result).toEqual(mockResult.rows[0]);
    });

    it('should throw an error if the query fails', async () => {
        mockClient.query.mockRejectedValueOnce(new Error('Test error'));

        await expect(getImageById(123)).rejects.toThrow('Test error');
    });
});
