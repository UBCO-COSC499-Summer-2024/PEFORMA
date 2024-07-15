import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsProfilePage from '../../../app/frontend/src/JS/Instructor/InsProfilePage';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

beforeAll(() => {
	global.alert = jest.fn();
});

afterAll(() => {
	jest.restoreAllMocks();
});


describe('InsProfilePage', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
			accountType: { accountType: 'mocked-accountType' },
		});
	});

	test('Check if context shows correctly', async () => {
		axios.get.mockImplementation(() =>
			Promise.resolve({
				data: {
					name: 'Billy Guy',
					ubcid: '18592831',
					benchmark: '1300',
					roles: ['Role1', 'Role2'],
					email: 'billyGuy@instructor.ubc.ca',
					phone: '778-333-2222',
					office: 'SCI 300',
					teachingAssignments: [
						{ assign: 'COSC 211', link: 'abc.com' },
						{ assign: 'COSC 304', link: 'def.com' },
					],
				},
			})
		);

		render(
			<MemoryRouter>
				<InsProfilePage />
			</MemoryRouter>
		);

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const element = document.getElementById('text-content');

		expect(element).toHaveTextContent("Billy Guy's Profile");
		expect(element).toHaveTextContent('Name: Billy Guy');

		expect(element).toHaveTextContent("UBC ID: 18592831");
		expect(element).toHaveTextContent("Service Roles: Role1, Role2");
		expect(element).toHaveTextContent("Monthly Hours Benchmark: 1300");
		expect(element).toHaveTextContent("Phone Number: 778-333-2222");
		expect(element).toHaveTextContent("Email: billyGuy@instructor.ubc.ca");
		expect(element).toHaveTextContent("Office Location: SCI 300");
	});
});
