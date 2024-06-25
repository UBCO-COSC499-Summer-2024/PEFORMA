const { saveDataToDatabase } = require('../routes/DataEntry');
const pool = require('../db/index');

jest.mock('../db/index');

describe('saveDataToDatabase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await pool.end(); // Ensure the pool is closed after all tests
    });

    it('should save a Service Role to the database', async () => {
        const mockData = {
            selection: 'Service Role',
            serviceRoleTitle: 'Test Service Role',
            serviceRoleDepartment: 'CS',
            serviceRoleDescription: 'Test Description'
        };

        const mockQuery = jest.fn().mockResolvedValue({ rows: [{ serviceRoleId: 1 }] });
        pool.query = mockQuery;

        await saveDataToDatabase(mockData);

        expect(mockQuery).toHaveBeenCalledTimes(3);
        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT setval(pg_get_serial_sequence('"ServiceRole"', 'serviceRoleId'), COALESCE((SELECT MAX("serviceRoleId") FROM "ServiceRole"), 0) + 1, false);`
        );
        expect(mockQuery).toHaveBeenCalledWith(
            `INSERT INTO public."ServiceRole"("stitle", "description", "isActive", "divisionId") VALUES($1, $2, true, $3) RETURNING "serviceRoleId";`,
            ['Test Service Role', 'Test Description', 1]
        );
    });

    it('should save a Course to the database', async () => {
        const mockData = {
            selection: 'Course',
            courseTitle: 'Test Course',
            courseDepartment: 'Mathematics',
            courseCode: 'MATH101',
            courseDescription: 'Test Course Description'
        };

        const mockQuery = jest.fn().mockResolvedValue({ rows: [{ courseId: 1 }] });
        pool.query = mockQuery;

        await saveDataToDatabase(mockData);

        expect(mockQuery).toHaveBeenCalledTimes(3);
        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT setval(pg_get_serial_sequence('"Course"', 'courseId'), COALESCE((SELECT MAX("courseId") FROM "Course"), 0) + 1, false);`
        );
        expect(mockQuery).toHaveBeenCalledWith(
            `INSERT INTO public."Course"(ctitle, description, "divisionId", "courseNum") VALUES($1, $2, $3, $4)`,
            ['Test Course', 'Test Course Description', 2, 'MATH101']
        );
    });

    it('should handle database errors gracefully', async () => {
        const mockData = {
            selection: 'Service Role',
            serviceRoleTitle: 'Test Service Role',
            serviceRoleDepartment: 'CS',
            serviceRoleDescription: 'Test Description'
        };

        const mockError = new Error('Test error');
        const mockQuery = jest.fn().mockRejectedValue(mockError);
        pool.query = mockQuery;

        await saveDataToDatabase(mockData);

        expect(mockQuery).toHaveBeenCalledTimes(1); // Since it should fail on the first query
        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT setval(pg_get_serial_sequence('"ServiceRole"', 'serviceRoleId'), COALESCE((SELECT MAX("serviceRoleId") FROM "ServiceRole"), 0) + 1, false);`
        );
    });
});
