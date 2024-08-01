import { fireEvent, render, screen, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopBar from '../../../app/frontend/src/JS/common/TopBar';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('TopBar', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // mock useNavigate
    useNavigate.mockReturnValue(mockNavigate);

    useAuth.mockReturnValue({
      authToken: { token: 'mocked-token' },
      profileId: 'mocked-profileId',
      accountType: [1, 3],
      accountLogInType: 1,
      setAccountLogInType: jest.fn(),
    });

    // mocking local storage
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'accountLogInType') {
        return '1';
      }
      return null;
    });

    render(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Testing logged in initially with department, accountLogInType 1', () => {
    // expect screen to show Department on topbar and show 1 as accountLogInType
    expect(screen.getByText('Department Head')).toBeInTheDocument();
    expect(localStorage.getItem('accountLogInType')).toBe('1');
  });

  test('Testing switch account to instructor from department', async () => {
    const profileElement = document.querySelector('.profile-initials') || document.querySelector('img[alt="Profile"]');
    fireEvent.click(profileElement);

    await act(async () => {
      fireEvent.click(screen.getByText('Switch account'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Instructor'));
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('accountLogInType', JSON.stringify(3));
    expect(mockNavigate).toHaveBeenCalledWith('/InsPerformancePage');

    useAuth.mockReturnValueOnce({
      authToken: { token: 'mocked-token' },
      profileId: 'mocked-profileId',
      accountType: [1, 3],
      accountLogInType: 3,
      setAccountLogInType: jest.fn(),
    });

    localStorage.getItem.mockImplementation((key) => {
      if (key === 'accountLogInType') {
        return '3';
      }
      return null;
    });

    render(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    );

    expect(localStorage.getItem('accountLogInType')).toBe('3');
  });

});
