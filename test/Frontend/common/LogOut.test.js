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

describe('LogOut', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);

    useAuth.mockReturnValue({
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'},
      accountType: [3, 4],
      accountLogInType: 3,
      setAccountLogInType: jest.fn(),
    });

    jest.spyOn(Storage.prototype, 'removeItem');
    window.alert = jest.fn(); //preventing alert console error

    render(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    );
  });


  test('Testing logout and see if localStorage has been removed', async () => {
    fireEvent.click(screen.getByText('Logout'));

    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('profileId');
    expect(localStorage.removeItem).toHaveBeenCalledWith('accountType');
    expect(localStorage.removeItem).toHaveBeenCalledWith('accountLogInType');

    // logged out state of local storage
    useAuth.mockReturnValueOnce({
      authToken: null,
      profileId: null,
      accountType: [],
      accountLogInType: null,
      setAccountLogInType: jest.fn(),
    });

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);

    render(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    )

    // check local storage is empty
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('profileId')).toBeNull();
    expect(localStorage.getItem('accountType')).toBeNull();
    expect(localStorage.getItem('accountLogInType')).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
