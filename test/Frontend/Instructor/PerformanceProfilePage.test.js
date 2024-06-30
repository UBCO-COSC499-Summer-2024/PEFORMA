import { render, element, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceInstructorPage from '../../../app/frontend/src/JS/Instructor/PerformanceInstructorPage';
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


describe('PerformanceInstructorPage', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
	});

	test('Check if context shows correctly', async () => {
		
		// axios.get.mockImplementation(() =>
		// 	Promise.resolve({
		// 		data: {
		// 			name: 'Billy Guy',
		// 			ubcid: '18592831',
		// 			benchmark: '1300',
		// 			roles: ['Role1', 'Role2'],
		// 			email: 'billyGuy@instructor.ubc.ca',
		// 			phone: '778-333-2222',
		// 			office: 'SCI 300',
		// 			teachingAssignments: [
		// 				{ assign: 'COSC 211', link: 'abc.com' },
		// 				{ assign: 'COSC 304', link: 'def.com' },
		// 			],
		// 		},
		// 	})
		// );

		render(
			<MemoryRouter>
				<PerformanceInstructorPage />
			</MemoryRouter>
		);

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(5));

    const element = document.getElementById('info-test-content');

		expect(element).toHaveTextContent("Your Information");
    expect(element).toHaveTextContent("Name:");
    expect(element).toHaveTextContent("UBC ID:");
    expect(element).toHaveTextContent("Service Roles:");
    expect(element).toHaveTextContent("Monthly Hours Benchmark:");
    expect(element).toHaveTextContent("Email:");

	});
});
