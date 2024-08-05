// adminStatusChange.test.js
import { StatusChangeMembers } from '../../../app/backend/services/UpdateStatus/adminStatusChange.js';
import { query as _query } from '../../../app/backend/db/index.js';
import { getAllInstructors } from '../../../app/backend/services/ShowList/allInstructorsService.js';

// Mock the database pool and the getAllInstructors function
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

jest.mock('../../../app/backend/services/ShowList/allInstructorsService.js', () => {
  return {
    getAllInstructors: jest.fn(),
  };
});

describe('StatusChangeMembers', () => {
  it('should change the status and return instructor data successfully', async () => {
    const req = {
      body: {
        memberId: '12345',
        newStatus: true,
      },
    };

    const mockProfileId = 1;
    const mockAccountData = { profileId: mockProfileId, isActive: true };
    const mockInstructorsData = [{ name: 'Instructor1' }, { name: 'Instructor2' }];

    _query
      .mockResolvedValueOnce({ rows: [{ profileId: mockProfileId }] })  // First query result
      .mockResolvedValueOnce({ rows: [mockAccountData] });              // Second query result

    getAllInstructors.mockResolvedValueOnce(mockInstructorsData);

    const result = await StatusChangeMembers(req);

    expect(result).toEqual(mockInstructorsData);
    //expect(pool.query).toHaveBeenCalledTimes(2);
    expect(getAllInstructors).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when no account data is found', async () => {
    const req = {
      body: {
        memberId: '12345',
        newStatus: true,
      },
    };

    _query
      .mockResolvedValueOnce({ rows: [{ profileId: 1 }] }) // First query result
      .mockResolvedValueOnce({ rows: [] });               // Second query result (no account data)

    await expect(StatusChangeMembers(req)).rejects.toThrow('No account data found');
    expect(_query).toHaveBeenCalled();
  });

  it('should throw an error if the query fails', async () => {
    const req = {
      body: {
        memberId: '12345',
        newStatus: true,
      },
    };

    _query.mockRejectedValueOnce(new Error('Database query failed'));

    await expect(StatusChangeMembers(req)).rejects.toThrow('Database query failed');
    expect(_query).toHaveBeenCalled();
  });
});
