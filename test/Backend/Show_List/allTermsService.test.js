const { getAllTerms } = require('../../../app/backend/services/ShowList/allTermsService.js');
const pool = require('../../../app/backend/db/index.js');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

describe('getAllTerms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the current term and list of all terms', async () => {
    // Mock return values
    const currentTermMock = '202301';
    const termsMock = ['202101', '202102', '202201', '202202', '202301'];

    pool.query
      .mockResolvedValueOnce({ rows: [{ curTerm: currentTermMock }] }) // Mock the result of the first query
      .mockResolvedValueOnce({ rows: termsMock.map(term => ({ term })) }); // Mock the result of the second query

    // Expected output
    const expectedOutput = {
      currentTerm: currentTermMock,
      terms: termsMock,
    };

    // Call the function
    const result = await getAllTerms();

    // Assert the result
    expect(result).toEqual(expectedOutput);
    expect(pool.query).toHaveBeenCalledWith('SELECT "curTerm" FROM "CurrentTerm"');
    expect(pool.query).toHaveBeenCalledWith('SELECT DISTINCT "term" FROM "CourseByTerm"');
  });

  it('should throw an error when the current term query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database query failed'));

    await expect(getAllTerms()).rejects.toThrow('Database query failed');
  });

  it('should throw an error when the terms query fails', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ curTerm: '202301' }] }) // Mock the result of the first query
      .mockRejectedValueOnce(new Error('Database query failed'));

    await expect(getAllTerms()).rejects.toThrow('Database query failed');
  });
});
