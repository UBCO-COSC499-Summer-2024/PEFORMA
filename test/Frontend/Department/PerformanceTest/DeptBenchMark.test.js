import {render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptBenchMark from '../../../../app/frontend/src/JS/Department/PerformanceImports/DeptBenchMark';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../../app/frontend/src/JS/common/AuthContext');

// Date.getMonth() starts from 0 index (0 = january) so 6 means july 
const mockCurrentDate = new Date(2024,6); 
global.Date = jest.fn(() => mockCurrentDate);

describe('DeptBenchMark', () => {
  let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {
          people:[
            {"name":"Kevin Kim","shortage":30},
            {"name":"Asen Lee","shortage":148},
            {"name":"Minsuk Oh","shortage":1},
            {"name":"Hyunji","shortage":60}
          ]
        }
			})
		);
    render(
			<MemoryRouter>
				<DeptBenchMark />
			</MemoryRouter>
		);
    element = document.getElementById('benchmark-test-content');
	});

	test('Testing header components of current month', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(element).toHaveTextContent("Benchmark");
    expect(element).toHaveTextContent("Current Month: July");
	});

  test('Testing rendering with mock data', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    expect(element).toHaveTextContent("Kevin Kim");
    expect(element).toHaveTextContent("Minsuk Oh");
    expect(element).toHaveTextContent("Asen Lee");
    expect(element).toHaveTextContent("Hyunji");

    expect(element).toHaveTextContent("30 Minutes");
    expect(element).toHaveTextContent("1 Minute");
    expect(element).toHaveTextContent("2 Hours 28 Minutes");
    expect(element).toHaveTextContent("1 Hour");

  })
});