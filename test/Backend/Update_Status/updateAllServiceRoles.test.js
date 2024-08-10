const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { updateAllServiceRoles } = require('../../../app/backend/services/UpdateStatus/updateAllServiceRoles');
const pool = require('../../../app/backend/db/index');
const { getLatestYear } = require('../../../app/backend/services/latestYear');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/latestYear');

describe('updateAllServiceRoles', () => {
    let mockClient;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(),
            release: jest.fn()
        };
        pool.connect = jest.fn().mockResolvedValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the status of all service roles based on the latest year', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        mockClient.query.mockResolvedValueOnce(); // BEGIN
        mockClient.query.mockResolvedValueOnce(); // Activate query
        mockClient.query.mockResolvedValueOnce(); // Deactivate query
        mockClient.query.mockResolvedValueOnce(); // COMMIT

        await updateAllServiceRoles();

        expect(pool.connect).toHaveBeenCalled();
        expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
        expect(mockClient.query).toHaveBeenNthCalledWith(2, expect.any(String), ['2023']);
        expect(mockClient.query).toHaveBeenNthCalledWith(3, expect.any(String), ['2023']);
        expect(mockClient.query).toHaveBeenNthCalledWith(4, 'COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback the transaction', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        mockClient.query.mockResolvedValueOnce(); // BEGIN
        mockClient.query.mockRejectedValueOnce(new Error('Test error')); // Error in Activate query

        console.error = jest.fn();

        await expect(updateAllServiceRoles()).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith('Error updating course status:', expect.any(Error));
        expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
        expect(mockClient.query).toHaveBeenNthCalledWith(2, expect.any(String), ['2023']);
        expect(mockClient.query).toHaveBeenNthCalledWith(3, 'ROLLBACK');
        expect(mockClient.release).toHaveBeenCalled();
    });
});
