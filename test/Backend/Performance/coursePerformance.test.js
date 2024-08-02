const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getCoursePerformance } = require('../../../app/backend/services/Performance/coursePerformance.js');
const pool = require('../../../app/backend/db/index.js');
const { getLatestTerm } = require('../../../app/backend/services/latestTerm.js');
const { updateAllCourses } = require('../../../app/backend/services/UpdateStatus/updateAllCourses.js')
// Mock the database pool
jest.mock('../../../app/backend/db/index.js');

// Mock the getLatestTerm function
jest.mock('../../../app/backend/services/latestTerm.js');

// Mock the updateAllCourses function
jest.mock('../../../app/backend/services/UpdateStatus/updateAllCourses.js');

describe('getCoursePerformance', () => {
  beforeEach(() => {
      pool.query.mockClear();
      updateAllCourses.mockClear();
      getLatestTerm.mockClear();
  });

  it('should return course performance data for a given division', async () => {
      const req = {
          query: {
              divisionId: '1'
          }
      };

      updateAllCourses.mockResolvedValue();
      getLatestTerm.mockResolvedValue('2024');
      pool.query.mockResolvedValue({
          rows: [
              { DivisionAndCourse: 'COSC 101', AverageScore: 85 },
              { DivisionAndCourse: 'COSC 102', AverageScore: 90 }
          ]
      });

      const result = await getCoursePerformance(req);

      expect(result).toEqual({
          courses: [
              { courseCode: 'COSC 101', rank: 'B', score: '85.00' },
              { courseCode: 'COSC 102', rank: 'A', score: '90.00' }
          ],
          currentTerm: '2024'
      });
  });

  it('should handle empty course performance data', async () => {
      const req = {
          query: {
              divisionId: '1'
          }
      };

      updateAllCourses.mockResolvedValue();
      getLatestTerm.mockResolvedValue('2024');
      pool.query.mockResolvedValue({
          rows: []
      });

      const result = await getCoursePerformance(req);

      expect(result).toEqual({
          courses: [],
          currentTerm: '2024'
      });
  });

  it('should throw an error if updateAllCourses fails', async () => {
      const req = {
          query: {
              divisionId: '1'
          }
      };

      updateAllCourses.mockRejectedValue(new Error('Failed to update courses'));

      await expect(getCoursePerformance(req)).rejects.toThrow('Failed to update courses');
  });

  it('should throw an error if getLatestTerm fails', async () => {
      const req = {
          query: {
              divisionId: '1'
          }
      };

      updateAllCourses.mockResolvedValue();
      getLatestTerm.mockRejectedValue(new Error('Failed to get latest term'));

      await expect(getCoursePerformance(req)).rejects.toThrow('Failed to get latest term');
  });

  it('should throw an error if pool.query fails', async () => {
      const req = {
          query: {
              divisionId: '1'
          }
      };

      updateAllCourses.mockResolvedValue();
      getLatestTerm.mockResolvedValue('2024');
      pool.query.mockRejectedValue(new Error('Database query failed'));

      await expect(getCoursePerformance(req)).rejects.toThrow('Database query failed');
  });
});
