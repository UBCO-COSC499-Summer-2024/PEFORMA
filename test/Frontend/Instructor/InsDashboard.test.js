import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import divisions from '../../../app/frontend/src/JS/common/divisions';
import InsDashboard from '../../../app/frontend/src/JS/Instructor/InsDashboard';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('../../../app/frontend/src/JS/common/AuthContext');
useAuth.mockReturnValue({
	profileId: { profileId: 'mocked-profileId' },
	accountType: { accountType: 'mocked-accountType' },
});

test('renders dashboard card image', () => {
	render(
		<MemoryRouter>
			<InsDashboard />
		</MemoryRouter>
	);
	const cardImg = screen.getByAltText('Computer Science');
	expect(cardImg).toBeInTheDocument();
});

test('Ensure all divisions are listed', () => {
	render(
		<MemoryRouter>
			<InsDashboard />
		</MemoryRouter>
	);
	const cards = screen.getAllByRole('gridcell');
	expect(cards.length).toBe(divisions.length);
});
