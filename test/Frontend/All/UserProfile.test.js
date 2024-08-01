import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../../../app/frontend/src/JS/All/UserProfile';
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
  current_courses: ['COSC 111', 'COSC 222'],
  current_service_roles: ['Undergraduate Advisor', 'Curriculum Committee'],
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

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all profile information correctly for instructors', async () => {
    setupTest(mockProfileData, [3]);

    await waitFor(() => expect(screen.getByText('My Profile')).toBeInTheDocument());

    // Check for header
    expect(screen.getByText('My Profile')).toBeInTheDocument();
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
    expect(screen.getByText('Hours Completed')).toBeInTheDocument();
    expect(screen.getByText('40 / 60 Hours')).toBeInTheDocument();

    // Check for Edit button
    expect(screen.getByText('Edit')).toBeInTheDocument();

    // Verify that CreateSideBar and CreateTopBar are rendered (as mocks)
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-topbar')).toBeInTheDocument();
  });

  test('renders profile information correctly for non-instructors', async () => {
    setupTest(mockProfileData, [1, 2]); // Assuming 1 and 2 are non-instructor account types

    await waitFor(() => expect(screen.getByText('My Profile')).toBeInTheDocument());

    // Check for header
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    
    // Performance Score should not be present for non-instructors
    expect(screen.queryByText('Performance Score')).not.toBeInTheDocument();

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

    // Teaching and Service sections should not be present for non-instructors
    expect(screen.queryByText('Teaching')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Course(s)')).not.toBeInTheDocument();
    expect(screen.queryByText('COSC 111')).not.toBeInTheDocument();
    expect(screen.queryByText('COSC 222')).not.toBeInTheDocument();

    expect(screen.queryByText('Service')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Service Role(s)')).not.toBeInTheDocument();
    expect(screen.queryByText('Undergraduate Advisor')).not.toBeInTheDocument();
    expect(screen.queryByText('Curriculum Committee')).not.toBeInTheDocument();
    expect(screen.queryByText('Hours Completed')).not.toBeInTheDocument();
    expect(screen.queryByText('40 / 60 Hours')).not.toBeInTheDocument();

    // Check for Edit button
    expect(screen.getByText('Edit')).toBeInTheDocument();

    // Verify that CreateSideBar and CreateTopBar are rendered (as mocks)
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-topbar')).toBeInTheDocument();
  });

  test('allows editing of profile information and saves changes', async () => {
    setupTest();

    await waitFor(() => expect(screen.getByText('My Profile')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Edit'));

    const nameInput = screen.getByPlaceholderText('First Last');
    const emailInput = screen.getByPlaceholderText('email@example.com');
    const officeInput = screen.getByDisplayValue('Room 101');
    const phoneInput = screen.getByDisplayValue('123-456-7890');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(officeInput, { target: { value: 'Room 202' } });
    fireEvent.change(phoneInput, { target: { value: '987-654-3210' } });

    const saveButton = screen.getByText('Save');
    
    // Mock the axios.put call
    axios.put.mockResolvedValue({ data: 'success' });

    fireEvent.click(saveButton);

    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3001/api/profile/1',
        expect.any(FormData),
        expect.any(Object)
      );
    });

    // Check if the form data contains the updated values
    const putCall = axios.put.mock.calls[0];
    const formData = putCall[1];
    expect(formData.get('name')).toBe('Jane Doe');
    expect(formData.get('email')).toBe('jane.doe@example.com');
    expect(formData.get('office_location')).toBe('Room 202');
    expect(formData.get('phone_number')).toBe('987-654-3210');
  });

  test('allows image upload', async () => {
    setupTest();
  
    await waitFor(() => expect(screen.getByText('My Profile')).toBeInTheDocument());
  
    fireEvent.click(screen.getByText('Edit'));
  
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: 'data:image/jpeg;base64,mockImageData',
      onloadend: null,
    };
    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader);
  
    // Create a mock file
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
  
    // Find the div with the overlay text
    const uploadOverlay = screen.getByText('Click to upload').closest('div');
    expect(uploadOverlay).toHaveClass('image-overlay');
  
    // Get the associated hidden file input
    const fileInput = uploadOverlay.parentElement.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  
    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    // Simulate FileReader onloadend
    mockFileReader.onloadend();
  
    // Check if the image data has been updated in the form data
    const saveButton = screen.getByText('Save');
    axios.put.mockResolvedValue({ data: 'success' });
    fireEvent.click(saveButton);
  
     // Verify that the API call includes the uploaded image
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      const putCall = axios.put.mock.calls[0];
      const formData = putCall[1];
      expect(formData.get('image')).toBeTruthy();
    });
  });
});