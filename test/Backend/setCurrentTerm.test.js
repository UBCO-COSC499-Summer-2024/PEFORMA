const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { setCurrentTerm } = require('../../app/backend/services/setCurrentTerm');
const pool = require('../../app/backend/db/index');

jest.mock('../../app/backend/db/index');

describe('setCurrentTerm', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                term: '202301'
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the current term successfully', async () => {
        pool.query.mockResolvedValueOnce();

        const result = await setCurrentTerm(req);

        expect(result).toBe(true);
    });

    it('should handle database query errors', async () => {
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();
        
        await expect(setCurrentTerm(req)).rejects.toThrow('Test error');
    });
});
