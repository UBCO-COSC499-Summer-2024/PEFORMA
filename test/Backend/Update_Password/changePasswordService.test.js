const { changePassword } = require('../../../app/backend/services/UpdatePassword/changePasswordService');
const pool = require('../../../app/backend/db/index.js');
const bcrypt = require('bcryptjs');

// Mock the database pool
jest.mock('../../../app/backend/db/index.js', () => {
  return {
    query: jest.fn(),
  };
});

// Mock the bcrypt module
jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn(),
    hash: jest.fn(),
  };
});

describe('changePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should catch when the password is incorrect', async () => {
    const profileId = 1;
    const currentPassword = 'oldPassword';
    const newPassword = 'newPassword';

    // Mock database responses
    pool.query
      .mockResolvedValueOnce({ rows: [{ password: 'hashedOldPassword' }] }) // For selecting current password
      .mockResolvedValueOnce({ rows: [] }); // For updating new password

    // Mock bcrypt responses
    bcrypt.compare.mockResolvedValue(true); // For comparing current password
    bcrypt.hash.mockResolvedValue('hashedNewPassword'); // For hashing new password

    // Call the function
    const result = await changePassword(profileId, currentPassword, newPassword);

    // Assert the result
    expect(result).toEqual({ success:false, message: "Current password is incorrect" });
});

  it('should return error when user is not found', async () => {
    const profileId = 9999;
    const currentPassword = 'oldPassword';
    const newPassword = 'newPassword';

    // Mock database responses
    pool.query.mockResolvedValueOnce({ rows: [{
        profileId: profileId, 
        currentPassword: currentPassword,
        newPassword: newPassword
    }] });

    // Call the function
    const result = await changePassword(profileId, currentPassword, newPassword);

    // Assert the result
    expect(result).toEqual({ success: false, message:"User not found" });
    //expect(pool.query).toHaveBeenCalledWith('SELECT password FROM "Account" WHERE "profileId" = $1', [profileId]);
  });
});
