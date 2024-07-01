import {render, screen, waitFor, element } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoscTable from '../../../../app/frontend/src/JS/Department/PerformanceImports/CoscTable';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
jest.mock('../../../../app/frontend/src/JS/AuthContext');

describe('CoscTable', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {
         courses: [{"courseCode" : "COSC 101", "rank":"A", "score":92},
          {"courseCode" : "COSC 499", "rank":"D", "score":60},
          {"courseCode" : "COSC 290", "rank":"D", "score":40},
          {"courseCode" : "COSC 391", "rank":"D", "score":50},
         ] }
			})
		);
    render(
			<MemoryRouter>
				<CoscTable />
			</MemoryRouter>
		);
	});

	test('Testing rendering cosc table with mock data', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const element = document.getElementById('cosc-test-content');
    expect(element).toHaveTextContent("COSC 101");
    expect(element).toHaveTextContent("COSC 499");
    expect(element).toHaveTextContent("COSC 290");
    expect(element).toHaveTextContent("COSC 391");
    
    expect(element).toHaveTextContent("92");
    expect(element).toHaveTextContent("60");
    expect(element).toHaveTextContent("40");
    expect(element).toHaveTextContent("50");

	});
});