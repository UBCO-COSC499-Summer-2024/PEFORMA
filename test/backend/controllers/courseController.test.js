const request = require('supertest');
const app = require('../../app');
const courseService = require('../../services/courseService'); // Import your courseService module


describe('Course Controller', () => {
  describe('GET /courses', () => {

    it('should return a 200 status and formatted course data when division code is valid', async () => {
      const mockData = {
        division: 'COSC',
        divisionLabel: 'Computer Science',
        currPage: 1,
        perPage: 10,
        divisionCoursesCount: 2,
        courses: [
          { id: 'COSC 111', title: 'Intro to Computer Science', instructor: ['Alice Smith'], ubcid: ['11111111'], email: ['alice@example.com'] },
          { id: 'COSC 222', title: 'Data Structures', instructor: ['Bob Johnson'], ubcid: ['22222222'], email: ['bob@example.com'] }
        ]
      };

      jest.spyOn(courseService, 'getFormattedCourseData').mockResolvedValue(mockData); // Mock the service call

      const res = await request(app).get('/courses?division=COSC');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockData); // Compare the entire response body
    });

    it('should return a 500 status and an error message when there is an error fetching courses', async () => {
      const errorMessage = 'Database error';
      jest.spyOn(courseService, 'getFormattedCourseData').mockRejectedValue(new Error(errorMessage)); 

      const res = await request(app).get('/courses?division=COSC');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'An error occurred' });
    });
  });
});
