import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../../../app/frontend/src/JS/Instructor/InsEditProfile';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock dependencies
jest.mock('../../../app/frontend/src/JS/common/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

// Mock sidebar and topbar components
jest.mock('../../../app/frontend/src/JS/common/commonImports.js', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-sidebar"></div>,
  CreateTopBar: () => <div data-testid="mock-topbar"></div>,
}));

// Sample profile data for testing
const mockProfileData = {
  UBCId: 12345,
  name: 'John Doe',
  email: 'john.doe@example.com',
  performance_score: 85,
  office_location: 'Room 101',
  phone_number: '123-456-7890',
  division: 'Computer Science',
  current_courses: [['COSC 111', 0], ['COSC 222', 1]],
  current_service_roles: [['Undergraduate Advisor', 0], ['Curriculum Committee', 1]],
  working_hours: 40,
  benchmark: 60,
  image_data: '',
  image_type: 'jpeg',
};

// Helper function to set up the test environment
const setupTest = (profileData = mockProfileData, accountType = [3]) => {
  useAuth.mockReturnValue({
    accountType: accountType,
    accountLogInType: accountType.includes(3) ? 3 : (accountType[0] || 1),
    profileId: 1,
    authToken: { token: 'dummyToken' },
  });

  axios.get.mockResolvedValue({ data: profileData });

  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );
};

describe('InsProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all profile information correctly for instructors', async () => {
    setupTest(mockProfileData, [3]);

    await waitFor(() => expect(screen.getByText('Instructor Profile')).toBeInTheDocument());

    // Check for header
    expect(screen.getByText('Instructor Profile')).toBeInTheDocument();
    expect(screen.getByText('Performance Score')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();

    // Check for top section
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('UBC ID: 12345')).toBeInTheDocument();

    // Check for Personal Information section
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Office Location')).toBeInTheDocument();
    expect(screen.getByText('Room 101')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('Division')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();

    // Check for Teaching section
    expect(screen.getByText('Teaching')).toBeInTheDocument();
    expect(screen.getByText('Current Course(s)')).toBeInTheDocument();
    expect(screen.getByText('COSC 111')).toBeInTheDocument();
    expect(screen.getByText('COSC 222')).toBeInTheDocument();

    // Check for Service section
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Current Service Role(s)')).toBeInTheDocument();
    expect(screen.getByText('Undergraduate Advisor')).toBeInTheDocument();
    expect(screen.getByText('Curriculum Committee')).toBeInTheDocument();
    expect(screen.getByText('Annual Service Hours')).toBeInTheDocument();
    expect(screen.getByText('60 Hours')).toBeInTheDocument();

    // Verify that CreateSideBar and CreateTopBar are rendered (as mocks)
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-topbar')).toBeInTheDocument();
  });
});