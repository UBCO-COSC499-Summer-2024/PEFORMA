// serviceRoleService.test.js (Integration Tests)

const serviceRoleService = require('../../../app/backend/services/serviceRoleService'); // Replace with your actual path
const testPool = require('../../../app/backend/db/testDb.js');

describe('serviceRoleService (Integration Tests - Real Database)', () => {
  // ... (setup and teardown for test database) ...
  beforeAll(async () => {
    // Seed the database with a subset of your sample data for service roles
    await testPool.query(`
      INSERT INTO "Division" ("dcode", "dname") VALUES 
        ('COSC', 'Computer Science'), ('MATH', 'Mathematics');

      INSERT INTO "ServiceRole" ("stitle", "description", "isActive", "divisionId") VALUES
        ('Undergraduate Advisor', 'Advises undergraduate students', true, 1),
        ('Curriculum Committee', 'Reviews curriculum', true, 2);

      INSERT INTO "ServiceRoleByYear" ("serviceRoleId", "year", "JANHour") VALUES
        (1, 2024, 5), (2, 2024, 10); 
    `);
  });

  afterAll(async () => {
    // Clean up the test data (optional if you're using a separate test database)
    await testPool.query('TRUNCATE TABLE "ServiceRoleAssignment", "ServiceRoleByYear", "ServiceRole", "Profile", "Division" CASCADE;');
    await testPool.end();
  });


  it('should fetch all active service roles', async () => {
    const expectedRoles = [
      { serviceRoleId: 1, stitle: 'Undergraduate Advisor', description: 'Advises undergraduate students', isActive: true, divisionId: 1 },
      { serviceRoleId: 2, stitle: 'Curriculum Committee', description: 'Reviews curriculum', isActive: true, divisionId: 2 },
    ];

    const result = await serviceRoleService.getAllServiceRoles();

    // Verify that the returned data matches the expected roles
    expect(result).toEqual(expectedRoles);
  });

  it('should fetch service roles by division ID', async () => {
    const divisionId = 1;
    const expectedRoles = [
      { serviceRoleId: 1, stitle: 'Undergraduate Advisor', description: 'Advises undergraduate students', isActive: true, divisionId: 1 },
    ];

    const result = await serviceRoleService.getServiceRolesByDivision(divisionId);

    expect(result).toEqual(expectedRoles);
  });

  // ... other tests for fetching service roles based on criteria like year, title, etc.

  it('should add a new service role and return the inserted data', async () => {
    const newServiceRole = {
      stitle: 'New Service Role',
      description: 'A new role for testing',
      isActive: true,
      divisionId: 1,
    };

    const result = await serviceRoleService.addServiceRole(newServiceRole);

    // Verify that the returned result matches the inserted data (including the generated ID)
    expect(result).toMatchObject(newServiceRole);
    expect(result.serviceRoleId).toBeDefined(); // Check if a serviceRoleId was generated

    // Verify that the new service role is in the database
    const dbResult = await testPool.query(`SELECT * FROM "ServiceRole" WHERE "serviceRoleId" = ${result.serviceRoleId}`);
    expect(dbResult.rows[0]).toMatchObject(result);
  });

  // ... tests for updating and deleting service roles ...

  it('should calculate total service hours for an instructor', async () => {
    const profileId = 1;
    const year = 2024;
    const expectedTotalHours = 5; 

    const result = await serviceRoleService.getTotalServiceHoursForInstructor(profileId, year);

    expect(result).toEqual(expectedTotalHours);
  });

  // ... other tests for service hour calculations and comparisons to benchmarks ...

});
