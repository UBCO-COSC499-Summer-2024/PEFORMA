import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminCreateAccount from '../../../app/frontend/src/JS/Admin/AdminCreateAccount';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('AdminCreateAccount', () => {
  let element; 

	beforeEach(() => {
    useAuth.mockReturnValue({
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'}
    });
    render(
      <MemoryRouter>
        <AdminCreateAccount />
      </MemoryRouter>
    );
    element = document.getElementById('admin-create-account-test-content');
  });
  test('renders CreateAccount form', () => {
    expect(element).toContainElement(screen.getByPlaceholderText('Email'));
    expect(element).toContainElement(screen.getByPlaceholderText('First Name'));
    expect(element).toContainElement(screen.getByPlaceholderText('Last Name'));
    expect(element).toContainElement(screen.getByPlaceholderText('UBC ID (optional)'));
    expect(element).toContainElement(screen.getByText('Select Department'));
    expect(element).toContainElement(screen.getByPlaceholderText('Password'));
    expect(element).toContainElement(screen.getByPlaceholderText('Confirm Password'));
    
  });
  test('Testing form input changes', () => {
    fireEvent.change(element.querySelector('input[name="email"]'), { target: { value: 'testing@gamil.com' } });
    fireEvent.change(element.querySelector('input[name="firstName"]'), { target: { value: 'Kevin' } });
    fireEvent.change(element.querySelector('input[name="lastName"]'), { target: { value: 'Kim' } });
    fireEvent.change(element.querySelector('input[name="ubcId"]'), { target: { value: '25347922' } });
    fireEvent.change(element.querySelector('select[name="division"]'), { target: { value: '1' } }); 
    fireEvent.change(element.querySelector('input[name="password"]'), { target: { value: 'qwer1@3$' } });
    fireEvent.change(element.querySelector('input[name="confirmPassword"]'), { target: { value: 'qwer1@3$' } });


    expect(element.querySelector('input[name="email"]').value).toBe('testing@gamil.com');
    expect(element.querySelector('input[name="firstName"]').value).toBe('Kevin');
    expect(element.querySelector('input[name="lastName"]').value).toBe('Kim');
    expect(element.querySelector('input[name="ubcId"]').value).toBe('25347922');
    expect(element.querySelector('select[name="division"]').value).toBe('1'); 
    expect(element.querySelector('input[name="password"]').value).toBe('qwer1@3$');
    expect(element.querySelector('input[name="confirmPassword"]').value).toBe('qwer1@3$');
  });
  test('Testing password matches', async () => {
    window.alert = jest.fn(); 
  
    fireEvent.change(element.querySelector('input[name="email"]'), { target: { value: 'random@gmail.com' } });
    fireEvent.change(element.querySelector('input[name="firstName"]'), { target: { value: 'random' } });
    fireEvent.change(element.querySelector('input[name="lastName"]'), { target: { value: 'guy' } });
    fireEvent.change(element.querySelector('input[name="ubcId"]'), { target: { value: '23546783' } });
    fireEvent.change(element.querySelector('select[name="division"]'), { target: { value: '2' } });
    fireEvent.change(element.querySelector('input[name="password"]'), { target: { value: 'pathworld' } });
    fireEvent.change(element.querySelector('input[name="confirmPassword"]'), { target: { value: 'wrongPassWord@' } });
  
    fireEvent.submit(element.querySelector('form'));
  
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Passwords do not match.'));
    expect(axios.post).not.toHaveBeenCalled(); // password do not match, no calling axios.post
  });
  test('Testing submit button works', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Account created successfully' } });

    fireEvent.change(element.querySelector('input[name="email"]'), { target: { value: 'braioh@gmail.com' } });
    fireEvent.change(element.querySelector('input[name="firstName"]'), { target: { value: 'Brain' } });
    fireEvent.change(element.querySelector('input[name="lastName"]'), { target: { value: 'Oh' } });
    fireEvent.change(element.querySelector('input[name="ubcId"]'), { target: { value: '55232312' } });
    fireEvent.change(element.querySelector('select[name="division"]'), { target: { value: '3' } });
    fireEvent.change(element.querySelector('input[name="password"]'), { target: { value: 'rand0mpassword1@' } });
    fireEvent.change(element.querySelector('input[name="confirmPassword"]'), { target: { value: 'rand0mpassword1@' } });

    fireEvent.submit(element.querySelector('form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/create-account',
      {
        email: 'braioh@gmail.com',
        firstName: 'Brain',
        lastName: 'Oh',
        ubcId: '55232312',
        division: '3',
        password: 'rand0mpassword1@',
        confirmPassword: 'rand0mpassword1@'
      },
      { headers: { Authorization: `Bearer mocked-token` } }
    ));

    await waitFor(() =>
      expect(element.querySelector('input[name="email"]').value).toBe(''),
      expect(element.querySelector('input[name="email"]').value).not.toBe('Brian')
    );
  });
  test('Testing cancel button will reset form', () => {
    fireEvent.change(element.querySelector('input[name="email"]'), { target: { value: 'test@example.com' } });
    fireEvent.change(element.querySelector('input[name="firstName"]'), { target: { value: 'random' } });
    fireEvent.change(element.querySelector('input[name="lastName"]'), { target: { value: 'guy' } });

    fireEvent.click(screen.getByText('Cancel'));

    expect(element.querySelector('input[name="email"]').value).toBe('');
    expect(element.querySelector('input[name="firstName"]').value).toBe('');
    expect(element.querySelector('input[name="lastName"]').value).toBe('');
  });
});