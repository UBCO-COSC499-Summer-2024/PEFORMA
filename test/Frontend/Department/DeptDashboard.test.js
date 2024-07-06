import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptDashboard from '../../../app/frontend/src/JS/Department/DeptDashboard';
import {MemoryRouter} from "react-router-dom";
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('../../../app/frontend/src/JS/common/AuthContext');

useAuth.mockReturnValue({
  profileId: { profileId: 'mocked-profileId'},
  accountType: { accountType: 'mocked-accountType' },
});

const cardNum = 5;
test('Ensure all cards are listed', () => {
    render(<MemoryRouter><DeptDashboard /></MemoryRouter>);
    const cards = screen.getAllByRole("gridcell");
    expect(cards.length).toBe(cardNum);
});