import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import divisions from '../../../app/frontend/src/JS/common/divisions';
import Dashboard from '../../../app/frontend/src/JS/Instructor/Dashboard';

test('renders dashboard card image', () => {
  render(<Dashboard />);
  const cardImg = screen.getByAltText("Computer Science");
  expect(cardImg).toBeInTheDocument();
});

test('Ensure all divisions are listed', () => {
    render(<Dashboard />);
    const cards = screen.getAllByRole("gridcell");
    expect(cards.length).toBe(divisions.length);
});