const request = require('supertest');
const app = require('../../../app/backend/app');
const courseService = require('../../../app/backend/services/courseService'); 

// Mock data for testing
const mockCourseData = {
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

describe('Course Controller (Docker)', () => {
  let server; 
  beforeAll(() => {
    server = app.listen(3002); // Start the server for testing
  });

  afterAll((done) => {
    server.close(done); // Close the server after testing
  });
  
  describe('GET /api/courses', () => {
    it('should return 200 status and formatted course data when division code is valid', async () => {
      jest.spyOn(courseService, 'getFormattedCourseData').mockResolvedValue(mockCourseData);
      const res = await request(server).get('/api/courses?division=COSC'); // Use 'server' for requests
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockCourseData); 
    });

    it('should return 500 status and error message when error occurs during data fetching', async () => {
      const errorMessage = 'Database error';
      jest.spyOn(courseService, 'getFormattedCourseData').mockRejectedValue(new Error(errorMessage));
      const res = await request(server).get('/api/courses?division=COSC'); 
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'An error occurred' });
    });

    it('should return 200 status and empty array if no courses are found for the division', async () => {
      const emptyData = { ...mockCourseData, courses: [] };
      jest.spyOn(courseService, 'getFormattedCourseData').mockResolvedValue(emptyData);
      const res = await request(server).get('/api/courses?division=MATH'); 
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(emptyData); 
    });
  });
});

// Mock the Authentication middleware 
jest.mock('../../../app/backend/Manager/authenticate', () => (req, res, next) => next()); 
