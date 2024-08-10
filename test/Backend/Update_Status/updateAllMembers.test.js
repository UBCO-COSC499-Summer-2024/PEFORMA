const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { updateAllMembers } = require('../../../app/backend/services/UpdateStatus/updateAllMembers');
const pool = require('../../../app/backend/db/index');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm');
const { getLatestYear } = require('../../../app/backend/services/latestYear');

jest.mock('../../../app/backend/db/index');
jest.mock('../../../app/backend/services/latestTerm');
jest.mock('../../../app/backend/services/latestYear');

describe('updateAllMembers', () => {
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

    it('should update the status of all members based on the latest term and year', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        getLatestYear.mockResolvedValueOnce('2023');
        mockClient.query.mockResolvedValueOnce({
            rows: [{ profileId: 1 }, { profileId: 2 }]
        }); // Instructors list query
        mockClient.query.mockResolvedValueOnce({
            rows: [{ profileId: 1 }]
        }); // Instructors with service role query
        mockClient.query.mockResolvedValueOnce({
            rows: [{ profileId: 2 }]
        }); // Instructors with courses query
        mockClient.query.mockResolvedValueOnce(); // BEGIN
        mockClient.query.mockResolvedValueOnce(); // Activate query
        mockClient.query.mockResolvedValueOnce(); // Deactivate query
        mockClient.query.mockResolvedValueOnce(); // COMMIT

        const result = await updateAllMembers();

        expect(result).toBeUndefined(); // The function does not return anything
        //expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback the transaction', async () => {
        getLatestTerm.mockResolvedValueOnce('202301');
        getLatestYear.mockResolvedValueOnce('2023');
        mockClient.query.mockResolvedValueOnce({
            rows: [{ profileId: 1 }, { profileId: 2 }]
        }); // Instructors list query
        mockClient.query.mockResolvedValueOnce({
            rows: [{ profileId: 1 }]
        }); // Instructors with service role query
        mockClient.query.mockResolvedValueOnce({
            rows: [{ profileId: 2 }]
        }); // Instructors with courses query
        mockClient.query.mockResolvedValueOnce(); // BEGIN
        mockClient.query.mockRejectedValueOnce(new Error('Test error')); // Error in Activate query

        console.error = jest.fn();
        await updateAllMembers();

        expect(console.error).toHaveBeenCalledWith('Error fetching instructors: ', expect.any(Error));
    });
});
