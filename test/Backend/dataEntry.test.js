const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { saveDataToDatabase } = require('../../app/backend/services/dataEntry.js');
const pool = require('../../app/backend/db/index.js');

// Mock the database pool
jest.mock('../../app/backend/db/index.js');

describe('saveDataToDatabase', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('should save a new Service Role to the database', async () => {
        const data = {
            selection: 'Service Role',
            serviceRoleTitle: 'Test Service Role',
            serviceRoleDepartment: 'COSC',
            serviceRoleDescription: 'Description for Test Service Role'
        };
        
        pool.query.mockImplementation((query, params) => {
            if (query.includes('SELECT * FROM "ServiceRole"')) {
                return { rows: [] };
            }
            if (query.includes('INSERT INTO public."ServiceRole"')) {
                return { rows: [{ serviceRoleId: 1 }] };
            }
            return;
        });

        await saveDataToDatabase(data);
        
        // No assertion needed for result, just verifying no errors are thrown
    });

    it('should save a new Course to the database', async () => {
        const data = {
            selection: 'Course',
            courseTitle: 'Test Course',
            courseDepartment: 'COSC',
            courseCode: '101',
            courseDescription: 'Description for Test Course'
        };
        
        pool.query.mockImplementation((query, params) => {
            if (query.includes('SELECT * FROM "Course"')) {
                return { rows: [] };
            }
            if (query.includes('INSERT INTO public."Course"')) {
                return { rows: [{ courseId: 1 }] };
            }
            return;
        });

        const result = await saveDataToDatabase(data);

        expect(result).toEqual({ rows: [{ courseId: 1 }] });
    });

    it('should throw an error if Service Role already exists', async () => {
        const data = {
            selection: 'Service Role',
            serviceRoleTitle: 'Existing Service Role',
            serviceRoleDepartment: 'COSC',
            serviceRoleDescription: 'Description for Existing Service Role'
        };
        
        pool.query.mockImplementation((query, params) => {
            if (query.includes('SELECT * FROM "ServiceRole"')) {
                return { rows: [{ serviceRoleId: 1 }] };
            }
            return;
        });

        await expect(saveDataToDatabase(data)).rejects.toThrow();
    });

    it('should throw an error if Course already exists', async () => {
        const data = {
            selection: 'Course',
            courseTitle: 'Existing Course',
            courseDepartment: 'COSC',
            courseCode: '101',
            courseDescription: 'Description for Existing Course'
        };
        
        pool.query.mockImplementation((query, params) => {
            if (query.includes('SELECT * FROM "Course"')) {
                return { rows: [{ courseId: 1 }] };
            }
            return;
        });

        await expect(saveDataToDatabase(data)).rejects.toThrow();
    });
});
