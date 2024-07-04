import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import divisions from '../../../app/frontend/src/JS/common/divisions';
import Dashboard from '../../../app/frontend/src/JS/Instructor/Dashboard';
import {MemoryRouter} from "react-router-dom";
import { useAuth } from '../../../app/frontend/src/JS/AuthContext';


jest.mock('../../../app/frontend/src/JS/AuthContext');
useAuth.mockReturnValue({
  profileId: { profileId: 'mocked-profileId'},
});

test('renders dashboard card image', () => {
  render(<MemoryRouter><Dashboard /></MemoryRouter>);
  const cardImg = screen.getByAltText("Computer Science");
  expect(cardImg).toBeInTheDocument();
});

test('Ensure all divisions are listed', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    const cards = screen.getAllByRole("gridcell");
    expect(cards.length).toBe(divisions.length);
});