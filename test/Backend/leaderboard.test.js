const { getLeaderBoard } = require('../../app/backend/controllers/leaderBoardController'); // Adjust the path as necessary
const pool = require('../../app/backend/db/index.js');

// Mocking the pool module
// Assuming the path needs to go up two directories and then into the app/backend/db directory
jest.mock('../../app/backend/db/index.js', () => ({
  query: jest.fn()
}));


describe('getLeaderBoard', () => {
  it('should return a response with the correct keys', async () => {
    const mockRequest = {};
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Setting up the mock data to return from the query
    pool.query.mockResolvedValueOnce({
      rows: [{ term: '2021' }]
    }).mockResolvedValueOnce({
      rows: [
        { full_name: 'John Doe', average_score: 85.7 },
        { full_name: 'Jane Doe', average_score: 90.1 },
        { full_name: 'Jim Beam', average_score: 88.5 }
      ]
    });

    // Call the function with mocked request and response
    await getLeaderBoard(mockRequest, mockResponse);

    // Check that the response has been called with the correct keys
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          x: expect.any(String),
          y: expect.any(Number)
        })
      ])
    });
  });

  it('should handle no data found by returning 404 status', async () => {
    const mockRequest = {};
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Setup for no rows found
    pool.query.mockResolvedValueOnce({
      rows: []
    });

    await getLeaderBoard(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No performance data found.' });
  });

  // Add more tests as needed to cover other scenarios and edge cases
});
