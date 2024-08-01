const { saveDataToDatabase } = require('../../app/backend/services/dataEntry.js');
const pool = require('../../app/backend/db/index.js');

// Mock the database pool
jest.mock('../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

describe('saveDataToDatabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a new service role to the database', async () => {
    const data = {
      selection: 'Service Role',
      serviceRoleTitle: 'Role Title',
      serviceRoleDepartment: 'COSC',
      serviceRoleDescription: 'Role Description',
    };

    pool.query
      .mockResolvedValueOnce({ rows: [] }) // Check if service role exists
      .mockResolvedValueOnce({}) // Set serial value
      .mockResolvedValueOnce({ rows: [{ serviceRoleId: 1 }] }); // Insert service role

    const result = await saveDataToDatabase(data);

    expect(result.rows[0].serviceRoleId).toBe(1);
  });

  it('should throw an error if service role already exists', async () => {
    const data = {
      selection: 'Service Role',
      serviceRoleTitle: 'Role Title',
      serviceRoleDepartment: 'COSC',
      serviceRoleDescription: 'Role Description',
    };

    pool.query.mockResolvedValueOnce({ rows: [{ serviceRoleId: 1 }] }); // Service role already exists

    await expect(saveDataToDatabase(data)).rejects.toThrow();
  });

  it('should save a new course to the database', async () => {
    const data = {
      selection: 'Course',
      courseTitle: 'Course Title',
      courseDepartment: 'COSC',
      courseCode: '101',
      courseDescription: 'Course Description',
    };

    pool.query
      .mockResolvedValueOnce({ rows: [] }) // Check if course exists
      .mockResolvedValueOnce({}) // Set serial value
      .mockResolvedValueOnce({ rows: [{ courseId: 1 }] }); // Insert course

    const result = await saveDataToDatabase(data);

    expect(result.rows[0].courseId).toBe(1);
  });

  it('should throw an error if course already exists', async () => {
    const data = {
      selection: 'Course',
      courseTitle: 'Course Title',
      courseDepartment: 'COSC',
      courseCode: '101',
      courseDescription: 'Course Description',
    };

    pool.query.mockResolvedValueOnce({ rows: [{ courseId: 1 }] }); // Course already exists

    await expect(saveDataToDatabase(data)).rejects.toThrow();
  });

  it('should handle errors and rollback if insert fails', async () => {
    const data = {
      selection: 'Course',
      courseTitle: 'Course Title',
      courseDepartment: 'COSC',
      courseCode: '101',
      courseDescription: 'Course Description',
    };

    pool.query
      .mockResolvedValueOnce({ rows: [] }) // Check if course exists
      .mockResolvedValueOnce({}) // Set serial value
      .mockRejectedValueOnce(new Error('Insert failed')); // Insert course fails

    await expect(saveDataToDatabase(data)).rejects.toThrow('Insert failed');
    expect(pool.query).toHaveBeenCalledWith('ROLLBACK');
  });
});
