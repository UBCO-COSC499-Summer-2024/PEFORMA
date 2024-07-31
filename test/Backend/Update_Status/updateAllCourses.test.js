const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { updateAllCourses } = require('../../../app/backend/services/UpdateStatus/updateAllCourses');
const pool = require('../../../app/backend/db/index');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/latestTerm');

describe('updateAllCourses', () => {
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

    it('should update the status of all courses based on the latest term', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        mockClient.query.mockResolvedValueOnce(); // BEGIN
        mockClient.query.mockResolvedValueOnce(); // Activate query
        mockClient.query.mockResolvedValueOnce(); // Deactivate query
        mockClient.query.mockResolvedValueOnce(); // COMMIT

        await updateAllCourses();

        expect(pool.connect).toHaveBeenCalled();
        expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
        expect(mockClient.query).toHaveBeenNthCalledWith(2, expect.any(String), ['202301']);
        expect(mockClient.query).toHaveBeenNthCalledWith(3, expect.any(String), ['202301']);
        expect(mockClient.query).toHaveBeenNthCalledWith(4, 'COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback the transaction', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        mockClient.query.mockResolvedValueOnce(); // BEGIN
        mockClient.query.mockRejectedValueOnce(new Error('Test error')); // Error in Activate query

        console.error = jest.fn();

        await expect(updateAllCourses()).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith('Error updating course status:', expect.any(Error));
        expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
        expect(mockClient.query).toHaveBeenNthCalledWith(2, expect.any(String), ['202301']);
        expect(mockClient.query).toHaveBeenNthCalledWith(3, 'ROLLBACK');
        expect(mockClient.release).toHaveBeenCalled();
    });
});
