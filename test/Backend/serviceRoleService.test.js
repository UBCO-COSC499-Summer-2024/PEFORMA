const { getAllServiceRoles } = require('../../app/backend/services/serviceRoleService.js');
const pool = require('../../app/backend/db/index.js');

// Mock the database pool
jest.mock('../../app/backend/db/index.js', () => ({
  query: jest.fn(),
}));

describe('getAllServiceRoles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted data with all service roles', async () => {
    // Mock the count query result
    pool.query.mockResolvedValueOnce({
      rows: [{ count: '5' }],
    });

    // Mock the main query result
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'Role 1', department: 'Dept A', description: 'Desc 1' },
        { id: 2, name: 'Role 2', department: 'Dept B', description: 'Desc 2' },
        { id: 3, name: 'Role 3', department: 'Dept A', description: 'Desc 3' },
        { id: 4, name: 'Role 4', department: 'Dept C', description: 'Desc 4' },
        { id: 5, name: 'Role 5', department: 'Dept B', description: 'Desc 5' },
      ],
    });

    const result = await getAllServiceRoles();

    expect(result).toEqual({
      currentPage: 1,
      perPage: 10,
      rolesCount: 5,
      roles: [
        { id: 1, name: 'Role 1', department: 'Dept A', description: 'Desc 1' },
        { id: 2, name: 'Role 2', department: 'Dept B', description: 'Desc 2' },
        { id: 3, name: 'Role 3', department: 'Dept A', description: 'Desc 3' },
        { id: 4, name: 'Role 4', department: 'Dept C', description: 'Desc 4' },
        { id: 5, name: 'Role 5', department: 'Dept B', description: 'Desc 5' },
      ],
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT COUNT(*)'));
    expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT "serviceRoleId" as id'));
  });

  it('should handle empty result set', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ count: '0' }],
    });

    pool.query.mockResolvedValueOnce({
      rows: [],
    });

    const result = await getAllServiceRoles();

    expect(result).toEqual({
      currentPage: 1,
      perPage: 10,
      rolesCount: 0,
      roles: [],
    });
  });

  it('should throw an error when database query fails', async () => {
    const testError = new Error('Database error');
    pool.query.mockRejectedValueOnce(testError);

    await expect(getAllServiceRoles()).rejects.toThrow('Database error');
  });

  it('should handle non-integer count result', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ count: 'not a number' }],
    });

    pool.query.mockResolvedValueOnce({
      rows: [],
    });

    const result = await getAllServiceRoles();

    expect(result.rolesCount).toBe(0);
  });
});