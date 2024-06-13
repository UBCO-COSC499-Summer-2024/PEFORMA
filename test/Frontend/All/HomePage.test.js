import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../../app/frontend/src/JS/All/HomePage';
import fetch from 'whatwg-fetch';

test('Checks for login button', () => {
  render(<HomePage />);
  const loginButton = screen.getByText("Login");
  expect(loginButton).toBeInTheDocument();
});

