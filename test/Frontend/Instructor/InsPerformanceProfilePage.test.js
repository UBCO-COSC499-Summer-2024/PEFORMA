import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsPerformancePage from '../../../app/frontend/src/JS/Instructor/InsPerformancePage';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import { __esModule } from '@babel/preset-env';

// mock axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-apexcharts', () => ({ // mock react-apexcharts
	__esModule: true,
	default: () => <div />
}));

describe('InsPerformancePage', () => {
	let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({ // mock authToken
			authToken: { token: 'mocked-token' },
		});
		axios.get.mockImplementation(() => 
			Promise.resolve({
				data: { // mock data
					name: 'Billy Guy',
					ubcid: '18592831',
					roles: [{roleTitle:'Role1'}, {roleTitle:'Role2'}],
          benchmark: '1300',
					email: 'billyGuy@instructor.ubc.ca',
          teachingAssignments: [
						{ assign: 'COSC 211' },
						{ assign: 'COSC 304' },
					],
          data:[
            {"x": "January", "y": 150},
          ]
				},
			})
		);
		render( // render InsPerformancePage
			<MemoryRouter>
				<InsPerformancePage />
			</MemoryRouter>
		);
		element = document.getElementById('info-test-content'); // set element by id
	});
	test('Testing rendering personal information with mock data', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
		// check if renders properly from mock data
    expect(element).toHaveTextContent("Welcome Billy Guy, check out your performance!")

		expect(element).toHaveTextContent("Your Information");
    expect(element).toHaveTextContent("Name: Billy Guy");
    expect(element).toHaveTextContent("UBC ID: 18592831");
    expect(element).toHaveTextContent("Service Roles: Role1, Role2");
    expect(element).toHaveTextContent("Monthly Hours Benchmark: 1300");
    expect(element).toHaveTextContent("Email: billyGuy@instructor.ubc.ca");

	});
  test('Testing teaching assignments rendered corretly', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(8));
		// check if teaching assignment renders well from mock data
    expect(element).toHaveTextContent("Teaching Assignments:COSC 211COSC 304")
	})
});
