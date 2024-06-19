const courseService = require('../../services/courseService');
const pool = require('../../config/db'); 

describe('Course Service', () => {
  describe('getFormattedCourseData', () => {
    afterEach(async () => {
      // Clean up the test database after each test
      await pool.query('TRUNCATE TABLE public."CourseByTerm", public."Course", public."InstructorTeachingAssignment", public."Profile" RESTART IDENTITY CASCADE;');
    });

    afterAll(async () => {
      await pool.end();
    });

    it('should fetch and correctly format course data for a valid division', async () => {
      // Insert test data into your database
      await pool.query('INSERT INTO public."CourseByTerm" ("term") VALUES (202309);');
      // ...(insert more test data as needed)

      const result = await courseService.getFormattedCourseData('COSC');
      
      expect(result).toHaveProperty('division', 'COSC');
      expect(result).toHaveProperty('divisionLabel', 'Computer Science');
      // Add more expectations based on the expected format of the course data
    });

    it('should return an empty array when no courses are found for the division', async () => {
      // Insert test data into your database for a different division than the one being tested
      await pool.query('INSERT INTO public."CourseByTerm" ("term") VALUES (202309);');
      // ...(insert more test data as needed for the different division)
      const result = await courseService.getFormattedCourseData('MATH'); // Test with 'MATH' division (no courses found)
      expect(result.courses).toHaveLength(0); 
    });


    it('should handle invalid division codes gracefully', async () => {
      await expect(courseService.getFormattedCourseData('INVALID')).rejects.toThrow(); // Expect an error to be thrown
    });
  });
});

