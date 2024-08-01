import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../app/frontend/src/JS/common/AuthContext';
import TopBar from '../../../app/frontend/src/JS/common/TopBar';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockUseAuth = {
  authToken: { token: 'mocked-token' },
  accountType: [1, 3], // 1: Department, 3: Instructor 
  accountLogInType: 1,
  profileId: 'mocked-profileId',
  setAccountLogInType: jest.fn(),
};

jest.mock('../../../app/frontend/src/JS/common/AuthContext', () => ({
  ...jest.requireActual('../../../app/frontend/src/JS/common/AuthContext'),
  useAuth: () => mockUseAuth,
}));

const setup = (initialRoute = '/', authOverrides = {}) => {
  Object.assign(mockUseAuth, authOverrides);
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <TopBar />
      </AuthProvider>
    </MemoryRouter>
  );
};

// Helper function to find and click the user icon
const clickUserIcon = async () => {
  const userIcon = await screen.findByAltText('Profile');
  fireEvent.click(userIcon);
};

// Helper function to get the dropdown menu
const getDropdownMenu = () => screen.getByRole('list', { className: 'dropdown-menu' });

describe('UserIcon Dropdown Component', () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
    axios.get.mockResolvedValue({
      data: {
        firstName: 'John',
        lastName: 'Doe'
      },
    });
  });

  // -- My profile --
  test('renders "My profile" option and navigates when clicked', async () => {
    setup();
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    const myProfileOption = within(dropdownMenu).getByText('My profile');
    expect(myProfileOption).toBeInTheDocument();

    fireEvent.click(myProfileOption);
    expect(navigateMock).toHaveBeenCalledWith('/UserProfile');
  });

  // -- My account & sub-menu --
  test('renders "My account" option and shows account menu when clicked', async () => {
    setup();
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    const myAccountOption = within(dropdownMenu).getByText('My account');
    expect(myAccountOption).toBeInTheDocument();

    fireEvent.click(myAccountOption);
    await waitFor(() => {
      expect(within(dropdownMenu).getByText('← Back')).toBeInTheDocument();
      expect(within(dropdownMenu).getByText('Change password')).toBeInTheDocument();
    });
  });

  test('renders "Change password" option in "My account" menu and navigates when clicked', async () => {
    setup();
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    const myAccountOption = within(dropdownMenu).getByText('My account');
    fireEvent.click(myAccountOption);

    const changePasswordOption = await within(dropdownMenu).findByText('Change password');
    expect(changePasswordOption).toBeInTheDocument();

    fireEvent.click(changePasswordOption);
    expect(navigateMock).toHaveBeenCalledWith('/ChangePassword');
  });

  test('renders "Back" button in "My account" menu and returns to main menu when clicked', async () => {
    setup();
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    const myAccountOption = within(dropdownMenu).getByText('My account');
    fireEvent.click(myAccountOption);

    const backButton = await within(dropdownMenu).findByText('← Back');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    await waitFor(() => {
      expect(within(dropdownMenu).getByText('My profile')).toBeInTheDocument();
      expect(within(dropdownMenu).getByText('My account')).toBeInTheDocument();
      expect(within(dropdownMenu).getByText('Switch account')).toBeInTheDocument();
    });
  });

  // -- Switch account & sub-menu --
  test('renders "Switch account" option and shows correct options for account types 1 and 3', async () => {
    setup();
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    const switchAccountOption = within(dropdownMenu).getByText('Switch account');
    expect(switchAccountOption).toBeInTheDocument();

    fireEvent.click(switchAccountOption);
    await waitFor(() => {
      expect(within(dropdownMenu).getByText('Department')).toBeInTheDocument();
      expect(within(dropdownMenu).getByText('Instructor')).toBeInTheDocument();
    });
  });

  test('renders "Back" button in "Switch account" menu and returns to main menu when clicked', async () => {
    setup();
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    const switchAccountOption = within(dropdownMenu).getByText('Switch account');
    fireEvent.click(switchAccountOption);

    const backButton = await within(dropdownMenu).findByText('← Back');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    await waitFor(() => {
      expect(within(dropdownMenu).getByText('My profile')).toBeInTheDocument();
      expect(within(dropdownMenu).getByText('My account')).toBeInTheDocument();
      expect(within(dropdownMenu).getByText('Switch account')).toBeInTheDocument();
    });
  });

  // -- Other cases for Switch account --
  test('renders "Switch account" option and shows correct options for account types 3 and 4', async () => {
    setup('/', { accountType: [3, 4], accountLogInType: 3 });
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    const switchAccountOption = within(dropdownMenu).getByText('Switch account');
    expect(switchAccountOption).toBeInTheDocument();

    fireEvent.click(switchAccountOption);
    await waitFor(() => {
      expect(within(dropdownMenu).getByText('Instructor')).toBeInTheDocument();
      expect(within(dropdownMenu).getByText('Admin')).toBeInTheDocument();
    });
  });

  test('does not render "Switch account" option for single account type', async () => {
    setup('/', { accountType: [1], accountLogInType: 1 });
    await clickUserIcon();

    const dropdownMenu = getDropdownMenu();
    await waitFor(() => {
      expect(within(dropdownMenu).queryByText('Switch account')).not.toBeInTheDocument();
    });
  });
});