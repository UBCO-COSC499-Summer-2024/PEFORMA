const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


const { importData } = require('../../app/backend/services/dataImportService.js');
const pool = require('../../app/backend/db/index.js');

jest.mock('../../app/backend/db/index.js');

describe('importData', () => {
    let mockClient;

    beforeEach(() => {
        mockClient = {
            connect: jest.fn().mockResolvedValue(mockClient),
            query: jest.fn(),
            release: jest.fn(),
        };
        pool.connect.mockResolvedValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should rollback transaction and throw error if processing fails', async () => {
        const files = [{ originalname: 'file1.csv', path: 'path/to/file1.csv' }];

        // Mocking processFile to simulate an error
        mockClient.query.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        await expect(importData(files)).rejects.toThrow('Test error');
        expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
        expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });

});
