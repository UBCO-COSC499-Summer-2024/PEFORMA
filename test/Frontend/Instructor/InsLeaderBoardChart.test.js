import { render, element, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsLeaderBoard from '../../../app/frontend/src/JS/Instructor/InsPerformanceImports/InsLeaderBoard';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import { __esModule } from '@babel/preset-env';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-apexcharts', () => ({
	__esModule: true,
	default: () => <div />
}));

describe('InsLeaderBoard', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({
			accountType: { accountType: 'mocked-accountType' },
			authToken: { token: 'mocked-token' },
		});
	});

	test('Testing apexchart to be called', async () => {

		render(
			<MemoryRouter>
				<InsLeaderBoard />
			</MemoryRouter>
		);

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
	});
});
