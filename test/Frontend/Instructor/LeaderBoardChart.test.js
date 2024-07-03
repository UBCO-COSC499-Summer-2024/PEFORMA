import { render, element, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeaderBoard from '../../../app/frontend/src/JS/leaderBoard';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/AuthContext';
import { __esModule } from '@babel/preset-env';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/AuthContext');
jest.mock('react-apexcharts', () => ({
	__esModule: true,
	default: () => <div />
}));

describe('LeaderBoard', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
	});

	test('Testing apexchart to be called', async () => {

		render(
			<MemoryRouter>
				<LeaderBoard />
			</MemoryRouter>
		);

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
	});
});
