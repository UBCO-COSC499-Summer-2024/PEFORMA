import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsLeaderBoard from '../../../app/frontend/src/JS/Instructor/InsPerformanceImports/InsLeaderBoard';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import { __esModule } from '@babel/preset-env';

// mocking axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-apexcharts', () => ({ // mocking react-apexcharts module 
	__esModule: true,
	default: () => <div />
}));

describe('InsLeaderBoard', () => {
	beforeEach(() => { 
		useAuth.mockReturnValue({ // mocking authToken for axios.get
			authToken: { token: 'mocked-token' },
		});
	});

	test('Testing apexchart to be called', async () => {
		// render InsLeaderBoard
		render(
			<MemoryRouter>
				<InsLeaderBoard />
			</MemoryRouter>
		);
		// waiting for axios.get to be called once, giving us the info that the chart used axios.get to fetch data
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
	});
});
