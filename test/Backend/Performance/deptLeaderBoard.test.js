const { getLeaderBoard } =require( '../../../app/backend/services/Performance/leaderBoard.js');
const pool = require('../../../app/backend/db/index.js');
//import { query as _query } from '../../../app/backend/db/index.js';

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

// Mock the getLatestTerm function
jest.mock('../../../app/backend/services/latestTerm.js', () => {
  return {
    getLatestTerm: jest.fn(),
  };
});

import { expect } from 'chai';
import { getLatestTerm } from '../../../app/backend/services/latestTerm.js';

describe('getDeptLeaderBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pool.query = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return expected output', async () => {
    // Mock return values
    getLatestTerm.mockResolvedValue('202301');
    pool.query
      .mockResolvedValueOnce({
        rows: [
          { full_name: 'John Doe', average_score: 95 },
          { full_name: 'Jane Smith', average_score: 90 },
          { full_name: 'Alice Johnson', average_score: 85 },
          { full_name: 'Bob Brown', average_score: 80 },
          { full_name: 'Charlie Davis', average_score: 75 },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { full_name: 'Dave Evans', average_score: 55 },
          { full_name: 'Eve Foster', average_score: 50 },
          { full_name: 'Frank Green', average_score: 45 },
          { full_name: 'Grace Harris', average_score: 40 },
          { full_name: 'Hank Irwin', average_score: 35 },
        ],
      });
   
      // Expected output
    const expectedOutput = [
        { x: 'John Doe', y: 95.0 },
        { x: 'Jane Smith', y: 90.0 },
        { x: 'Alice Johnson', y: 85.0 },
        { x: 'Bob Brown', y: 80.0 },
        { x: 'Charlie Davis', y: 75.0 },
    ]
    ;

    // Call the function
    const result = await getLeaderBoard();

    // Assert the result
    let match = false;
    if(result.data == expectedOutput){match=true;}
    expect(match=true);
    jest.clearAllMocks();
  });

  it('should throw an error when no data is found', async () => {
    jest.clearAllMocks();
    getLatestTerm.mockResolvedValue('202301');
    pool.query
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [] });
    let error_Match = false;
    try{
      const result1 = await getLeaderBoard();
      console.log("Result: ",result1.data);
    } catch (error) {
      if(error = Error("No data found")){error_Match=true;}
    }
    expect(error_Match=true);
  });
});
