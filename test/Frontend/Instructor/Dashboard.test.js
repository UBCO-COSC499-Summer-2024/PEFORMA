import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../../app/frontend/src/JS/Instructor/Dashboard';

test('renders dashboard card image', () => {
  render(<Dashboard />);
  const cardImg = screen.getByAltText("Computer Science");
  expect(cardImg).toBeInTheDocument();
});