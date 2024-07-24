import { fireEvent, render, screen, act } from '@testing-library/react';
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
      profileId: { profileId: 'mocked-profileId'},
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
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(localStorage.getItem('accountLogInType')).toBe('1');
  })
  test('Testing switch account to instructor from department', async () => {
    fireEvent.click(screen.getByAltText('Switch Account'));

    await act(async () => {
      fireEvent.click(screen.getByText('Instructor'));
    });
    // check if setAccountLogInType is set to 3
    expect(useAuth().setAccountLogInType).toHaveBeenCalledWith(3);

    // check local storage if accountLogInType is set to 3
    expect(localStorage.setItem).toHaveBeenCalledWith('accountLogInType', JSON.stringify(3));

    // check navigate to /InsPerformancePage 
    expect(mockNavigate).toHaveBeenCalledWith('/InsPerformancePage');

    // mocking useAuth again to reflect to new state
    useAuth.mockReturnValueOnce({
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'},
      accountType: [1, 3],
      accountLogInType: 3, // set accountLogInType to 3
      setAccountLogInType: jest.fn(),
    })

    localStorage.getItem.mockImplementation((key) => {
      if (key === 'accountLogInType') {
        return '3'; // not set to return 3 for accountLogInType
      }
      return null;
    });

    render(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    );
    // now expect screen to show Instructor on topbar and show 3 as accountLogInType because switched to instructor
    expect(screen.getByText('Instructor')).toBeInTheDocument();
    expect(localStorage.getItem('accountLogInType')).toBe('3');
  });
});
