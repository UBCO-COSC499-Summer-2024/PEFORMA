import { fireEvent, render, screen, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';


import Login from '../../../app/frontend/src/JS/All/Login';

test('tests login user input', () => {
    
  render(<Login />);
  let email = screen.getByPlaceholderText("Email Address");
  expect(email).toBeInTheDocument();
  
});