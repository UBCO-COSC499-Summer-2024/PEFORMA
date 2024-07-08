const { getAllServiceRoles } = require('../../app/backend/controllers/serviceRoleController'); // Adjust the path as needed
const serviceRoleService = require('../../app/backend/services/serviceRoleService');

// Mock the serviceRoleService
jest.mock('../../app/backend/services/serviceRoleService');

describe('Service Role Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllServiceRoles', () => {
    it('should return service roles successfully', async () => {
      const mockServiceRoles = [
        { id: 1, name: 'Role 1' },
        { id: 2, name: 'Role 2' },
      ];
      serviceRoleService.getAllServiceRoles.mockResolvedValue(mockServiceRoles);

      await getAllServiceRoles(mockRequest, mockResponse);

      expect(serviceRoleService.getAllServiceRoles).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceRoles);
    });

    it('should handle errors and return 500 status', async () => {
      const mockError = new Error('Database error');
      serviceRoleService.getAllServiceRoles.mockRejectedValue(mockError);

      await getAllServiceRoles(mockRequest, mockResponse);

      expect(serviceRoleService.getAllServiceRoles).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch service roles' });
    });

    it('should log the error when fetching service roles fails', async () => {
      const mockError = new Error('Database error');
      serviceRoleService.getAllServiceRoles.mockRejectedValue(mockError);
      console.error = jest.fn(); // Mock console.error

      await getAllServiceRoles(mockRequest, mockResponse);

      expect(console.error).toHaveBeenCalledWith('Error fetching service roles:', mockError);
    });

    it('should return an empty array if no service roles are found', async () => {
      serviceRoleService.getAllServiceRoles.mockResolvedValue([]);

      await getAllServiceRoles(mockRequest, mockResponse);

      expect(serviceRoleService.getAllServiceRoles).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });
});