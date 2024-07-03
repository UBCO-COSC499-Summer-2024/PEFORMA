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

	test('Testing rendering personal information with mock data', async () => {
		
		axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {
					name: 'Billy Guy',
					ubcid: '18592831',
					roles: ['Role1', 'Role2'],
          benchmark: '1300',
					email: 'billyGuy@instructor.ubc.ca',
          teachingAssignments: [
						{ assign: 'COSC 211', link: 'abc.com' },
						{ assign: 'COSC 304', link: 'def.com' },
					],
          data:[
            {"x": "January", "y": 150},
          ]
				},
			})
		);

		render(
			<MemoryRouter>
				<PerformanceInstructorPage />
			</MemoryRouter>
		);

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(5));

    const element = document.getElementById('info-test-content');
    
    expect(element).toHaveTextContent("Welcome Billy Guy, check out your performance!")

		expect(element).toHaveTextContent("Your Information");
    expect(element).toHaveTextContent("Name: Billy Guy");
    expect(element).toHaveTextContent("UBC ID: 18592831");
    expect(element).toHaveTextContent("Service Roles: Role1, Role2");
    expect(element).toHaveTextContent("Monthly Hours Benchmark: 1300");
    expect(element).toHaveTextContent("Email: billyGuy@instructor.ubc.ca");

	});
  test('Testing teaching assignments rendered corretly', async () => {
		
		axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {
					name: 'Billy Guy',
					ubcid: '18592831',
					roles: ['Role1', 'Role2'],
          benchmark: '1300',
					email: 'billyGuy@instructor.ubc.ca',
          teachingAssignments: [
						{ assign: 'COSC 211', link: 'abc.com' },
						{ assign: 'COSC 304', link: 'def.com' },
					],
          data:[
            {"x": "January", "y": 150},
          ]
				},
			})
		);

		render(
			<MemoryRouter>
				<PerformanceInstructorPage />
			</MemoryRouter>
		);

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(10));

    const element = document.getElementById('info-test-content');
    
    expect(element).toHaveTextContent("Teaching Assignments: COSC 211 COSC 304")
	})
});