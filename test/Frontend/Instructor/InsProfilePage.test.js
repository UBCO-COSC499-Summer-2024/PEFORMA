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
			accountLogInType: 'instructor',
		});

		axios.get.mockResolvedValue({
			data: {
				name: 'Billy Guy',
				ubcid: '18592831',
				benchmark: '1300',
				roles: [
					{ roleTitle: 'Role1', roleId: 1 },
					{ roleTitle: 'Role2', roleId: 2 }
				],
				email: 'billyGuy@instructor.ubc.ca',
				phone: '778-333-2222',
				office: 'SCI 300',
				teachingAssignments: [
					{ assign: 'COSC 211', courseId: 1 },
					{ assign: 'COSC 304', courseId: 2 }
				],
			}
		});
	});

	test('Check if context shows correctly', async () => {
    render(
			<MemoryRouter initialEntries={['/somepath?ubcid=18592831']}>
				<InsProfilePage />
			</MemoryRouter>
    );

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledWith(
				"http://localhost:3001/api/instructorProfile",
				expect.objectContaining({
					headers: {
						Authorization: 'Bearer mocked-token'
					},
					params: { ubcid: null } 
				})
			);
		});

		await waitFor(() => {
			const element = document.getElementById('profile-test-content');
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
});
