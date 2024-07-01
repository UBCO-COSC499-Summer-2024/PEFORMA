import {render, screen, waitFor, element } from '@testing-library/react';
import '@testing-library/jest-dom';
import BenchMark from '../../../../app/frontend/src/JS/Department/PerformanceImports/BenchMark';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
jest.mock('../../../../app/frontend/src/JS/AuthContext');

// Date.getMonth() starts from 0 index (0 = january) so 6 means july 
const mockCurrentDate = new Date(2024,6); 
global.Date = jest.fn(() => mockCurrentDate);

describe('BenchMark', () => {
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
				<BenchMark />
			</MemoryRouter>
		);
	});

	test('Testing header components of current month', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const element = document.getElementById('benchmark-test-content');
    expect(element).toHaveTextContent("Benchmark");
    expect(element).toHaveTextContent("Current Month: July");
	});

  test('Testing rendering with mock data', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    const element = document.getElementById('benchmark-test-content');
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