import {render, screen, waitFor, element } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoscTable from '../../../../app/frontend/src/JS/Department/PerformanceImports/CoscTable';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../../app/frontend/src/JS/AuthContext';
import userEvent from '@testing-library/user-event';

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
          {"courseCode" : "COSC 123", "rank":"C", "score":72},
          {"courseCode" : "COSC 290", "rank":"D", "score":65},
          {"courseCode" : "COSC 391", "rank":"D", "score":62},
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
    expect(element).toHaveTextContent("COSC 123");
    expect(element).toHaveTextContent("COSC 290");
    expect(element).toHaveTextContent("COSC 391");

    expect(element).toHaveTextContent("A");
    expect(element).toHaveTextContent("C");
    expect(element).toHaveTextContent("D");
    expect(element).toHaveTextContent("D");
    
    expect(element).toHaveTextContent("92");
    expect(element).toHaveTextContent("72");
    expect(element).toHaveTextContent("65");
    expect(element).toHaveTextContent("62");

	});

  test('Testing filter courses by clicking year number 1', async () => {
    const year1Button = screen.getByRole('button', { name: '1' });
    userEvent.click(year1Button);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3);
    })
    const element = document.getElementById('cosc-test-content');
    expect(element).toHaveTextContent('COSC 101');
    expect(element).toHaveTextContent('A');
    expect(element).toHaveTextContent('92');

    expect(element).toHaveTextContent('COSC 123');
    expect(element).toHaveTextContent('C');
    expect(element).toHaveTextContent('72');
  })
  
});