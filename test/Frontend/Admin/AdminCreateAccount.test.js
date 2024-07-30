import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminCreateAccount from '../../../app/frontend/src/JS/Admin/AdminCreateAccount';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mocking axios and useAuth modules
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('AdminCreateAccount', () => {
  let element; 

  // setup function to run before each test
	beforeEach(() => {
    useAuth.mockReturnValue({ // mocking token and profileId
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'}
    });
    render( // render AdminCreateAccount component
      <MemoryRouter>
        <AdminCreateAccount />
      </MemoryRouter>
    );
    element = document.getElementById('admin-create-account-test-content'); // get element by id
  });
  test('renders CreateAccount form', () => { // check if CreateAccount form is rendered properly
    expect(element).toContainElement(screen.getByPlaceholderText('Email'));
    expect(element).toContainElement(screen.getByPlaceholderText('First Name'));
    expect(element).toContainElement(screen.getByPlaceholderText('Last Name'));
    expect(element).toContainElement(screen.getByPlaceholderText('UBC ID (optional)'));
    expect(element).toContainElement(screen.getByText('Select Department'));
    expect(element).toContainElement(screen.getByLabelText('Department Head'));
    expect(element).toContainElement(screen.getByLabelText('Department Staff'));
    expect(element).toContainElement(screen.getByLabelText('Instructor'));
    expect(element).toContainElement(screen.getByLabelText('Admin'));
    expect(element).toContainElement(screen.getByPlaceholderText('Password'));
    expect(element).toContainElement(screen.getByPlaceholderText('Confirm Password'));
});
  test('Testing form input changes', () => { // check if the form input values change correctly
    fireEvent.change(element.querySelector('input[name="email"]'), { target: { value: 'testing@gamil.com' } });
    fireEvent.change(element.querySelector('input[name="firstName"]'), { target: { value: 'Kevin' } });
    fireEvent.change(element.querySelector('input[name="lastName"]'), { target: { value: 'Kim' } });
    fireEvent.change(element.querySelector('input[name="ubcId"]'), { target: { value: '25347922' } });
    fireEvent.change(element.querySelector('select[name="division"]'), { target: { value: '1' } }); 
    fireEvent.click(element.querySelector('input[name="DepartmentHead"]'));
    fireEvent.click(element.querySelector('input[name="Instructor"]'));
    fireEvent.click(element.querySelector('input[name="Admin"]'));
    fireEvent.change(element.querySelector('input[name="password"]'), { target: { value: 'qwer1@3$' } });
    fireEvent.change(element.querySelector('input[name="confirmPassword"]'), { target: { value: 'qwer1@3$' } });

    expect(element.querySelector('input[name="email"]').value).toBe('testing@gamil.com');
    expect(element.querySelector('input[name="firstName"]').value).toBe('Kevin');
    expect(element.querySelector('input[name="lastName"]').value).toBe('Kim');
    expect(element.querySelector('input[name="ubcId"]').value).toBe('25347922');
    expect(element.querySelector('select[name="division"]').value).toBe('1'); 
    expect(element.querySelector('input[name="DepartmentHead"]').checked).toBe(true);
    expect(element.querySelector('input[name="DepartmentStaff"]').checked).toBe(false);
    expect(element.querySelector('input[name="Instructor"]').checked).toBe(true);
    expect(element.querySelector('input[name="Admin"]').checked).toBe(true);
    expect(element.querySelector('input[name="password"]').value).toBe('qwer1@3$');
    expect(element.querySelector('input[name="confirmPassword"]').value).toBe('qwer1@3$');
  });
  test('Testing accountType checkbox changes', () => { // check accountType checkbox change corretly
    fireEvent.click(element.querySelector('input[name="DepartmentHead"]'));
    fireEvent.click(element.querySelector('input[name="Admin"]'));

    expect(element.querySelector('input[name="DepartmentHead"]').checked).toBe(true); // clicked checkbox, so true
    expect(element.querySelector('input[name="DepartmentStaff"]').checked).toBe(false);
    expect(element.querySelector('input[name="Instructor"]').checked).not.toBe(true); //didnt check Instructor checkbox so should be False
    expect(element.querySelector('input[name="Admin"]').checked).toBe(true); // clicked checkbox, so true
  });

  test('Testing password matches', async () => { // test password validation function works well
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
  test('Testing submit button works', async () => { // test axios.post is working when submit button is clicked
    axios.post.mockResolvedValue({ data: { message: 'Account created successfully' } });

    fireEvent.change(element.querySelector('input[name="email"]'), { target: { value: 'braioh@gmail.com' } });
    fireEvent.change(element.querySelector('input[name="firstName"]'), { target: { value: 'Brain' } });
    fireEvent.change(element.querySelector('input[name="lastName"]'), { target: { value: 'Oh' } });
    fireEvent.change(element.querySelector('input[name="ubcId"]'), { target: { value: '55232312' } });
    fireEvent.change(element.querySelector('select[name="division"]'), { target: { value: '3' } });
    fireEvent.click(element.querySelector('input[name="DepartmentHead"]'));
    fireEvent.click(element.querySelector('input[name="Instructor"]'));
    fireEvent.change(element.querySelector('input[name="password"]'), { target: { value: 'rand0mpassword1@' } });
    fireEvent.change(element.querySelector('input[name="confirmPassword"]'), { target: { value: 'rand0mpassword1@' } });

    fireEvent.submit(element.querySelector('form'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith( // submit buttom clicked, axois.post with postData
      'http://localhost:3001/api/create-account',
      {
        email: 'braioh@gmail.com',
        firstName: 'Brain',
        lastName: 'Oh',
        ubcId: '55232312',
        division: '3',
        accountType: [1, 3], 
        password: 'rand0mpassword1@',
        confirmPassword: 'rand0mpassword1@'
      },
      { headers: { Authorization: `Bearer mocked-token` } }
    ));

    await waitFor(() => { // check every inputs are '' after posting data
      expect(element.querySelector('input[name="email"]').value).toBe('');
      expect(element.querySelector('input[name="firstName"]').value).toBe('');
      expect(element.querySelector('input[name="lastName"]').value).toBe('');
      expect(element.querySelector('input[name="ubcId"]').value).toBe('');
      expect(element.querySelector('select[name="division"]').value).toBe('');
      expect(element.querySelector('input[name="password"]').value).toBe('');
      expect(element.querySelector('input[name="confirmPassword"]').value).toBe('');
      expect(element.querySelector('input[name="DepartmentHead"]').checked).toBe(false);
      expect(element.querySelector('input[name="DepartmentStaff"]').checked).toBe(false);
      expect(element.querySelector('input[name="Instructor"]').checked).toBe(false);
      expect(element.querySelector('input[name="Admin"]').checked).toBe(false);
    });
  });
  test('Testing cancel button will reset form', () => { // test if every input resets when cancel button is clicked
    fireEvent.change(element.querySelector('input[name="email"]'), { target: { value: 'test@example.com' } });
    fireEvent.change(element.querySelector('input[name="firstName"]'), { target: { value: 'random' } });
    fireEvent.change(element.querySelector('input[name="lastName"]'), { target: { value: 'guy' } });
    fireEvent.click(element.querySelector('input[name="Instructor"]'));
    fireEvent.click(element.querySelector('input[name="Admin"]'));

    expect(element.querySelector('input[name="Instructor"]').checked).toBe(true); //  check Instructor
    expect(element.querySelector('input[name="Admin"]').checked).toBe(true); // check Admin

    fireEvent.click(screen.getByText('Cancel')); // press cancel button

    expect(element.querySelector('input[name="email"]').value).toBe('');
    expect(element.querySelector('input[name="firstName"]').value).toBe('');
    expect(element.querySelector('input[name="lastName"]').value).toBe('');
    expect(element.querySelector('input[name="Instructor"]').checked).toBe(false); // check if disabled
    expect(element.querySelector('input[name="Admin"]').checked).toBe(false); // check if disabled
  });
});