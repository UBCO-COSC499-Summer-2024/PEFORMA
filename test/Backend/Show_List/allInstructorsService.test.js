// allInstructorsService.test.js
const { getAllInstructors } = require('../../../app/backend/services/ShowList/allInstructorsService.js');
const pool = require('../../../app/backend/db/index.js');
const faker = require('faker');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

// Helper function to generate random instructors
const generateRandomInstructors = (count) => {
  const instructors = [];
  for (let i = 0; i < count; i++) {
    const middleName = faker.datatype.boolean() ? faker.name.firstName() : '';
    instructors.push({
      UBCId: faker.datatype.uuid(),
      firstName: faker.name.firstName(),
      middleName: middleName,
      lastName: faker.name.lastName(),
      dname: faker.commerce.department(),
      roleid: [faker.datatype.number()],
      stitle: [faker.name.jobTitle()],
      email: faker.internet.email(),
      isActive: faker.datatype.boolean()
    });
  }
  return instructors;
};

describe('getAllInstructors', () => {
  it('should return data successfully', async () => {
    // Generate random mock data
    const mockData = generateRandomInstructors(5);  // Generate 5 random instructors

    pool.query.mockResolvedValue({ rowCount: mockData.length, rows: mockData });

    const result = await getAllInstructors();

    expect(result).toBeDefined();
    expect(result.membersCount).toBeGreaterThan(0);
  });

  it('should throw an error when the query fails', async () => {
    pool.query.mockRejectedValue(new Error('Database query failed'));

    await expect(getAllInstructors()).rejects.toThrow('Database query failed');
  });
});
