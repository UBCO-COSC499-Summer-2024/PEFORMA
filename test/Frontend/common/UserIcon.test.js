import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UserIcon } from '../../../app/frontend/src/JS/common/utils';

describe('UserIcon Component', () => {
  // Mock props to be used across all tests
  const mockProps = {
    userName: 'John Doe',
    profileId: 'mocked-profileId',
    size: 40,
    onClick: jest.fn(),
  };

  // Before each test, clear all mocks to ensure a clean slate
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user image when available', async () => {
    render(<UserIcon {...mockProps} />);
    const userImage = await screen.findByAltText('Profile');
    expect(userImage).toBeInTheDocument();

    // Assert that the image src contains the correct profile ID
    expect(userImage).toHaveAttribute('src', expect.stringContaining(mockProps.profileId));
  });

  test('renders user initials when image is not available', async () => {
    render(<UserIcon {...mockProps} />);
    const img = await screen.findByAltText('Profile');
    
    // Simulate an error event on the image (e.g., image failed to load)
    fireEvent.error(img);

    // Wait for the component to update and render initials
    await waitFor(() => {
      const initialsElement = screen.getByText('JD');
      expect(initialsElement).toBeInTheDocument();
    });
  });

  test('applies correct size to icon', async () => {
    render(<UserIcon {...mockProps} size={60} />);
    const icon = await screen.findByAltText('Profile');
    expect(icon).toHaveStyle('width: 60px');
    expect(icon).toHaveStyle('height: 60px');
  });

  test('calls onClick when icon is clicked', async () => {
    render(<UserIcon {...mockProps} />);
    const icon = await screen.findByAltText('Profile');
    fireEvent.click(icon);
    expect(mockProps.onClick).toHaveBeenCalled();
  });
});