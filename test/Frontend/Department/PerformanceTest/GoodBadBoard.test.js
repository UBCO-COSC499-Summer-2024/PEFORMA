import {render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoodBadBoard from '../../../../app/frontend/src/JS/Department/PerformanceImports/GoodBadBoard';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../../app/frontend/src/JS/AuthContext';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
jest.mock('../../../../app/frontend/src/JS/AuthContext');

describe('GoodBadBoard', () => {
  let element;

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {
          top:[
            {"name":"John", "score":"95"},
            {"name":"Doe", "score":"90"},
            {"name":"Martin", "score":"97"},
          ],
          bottom:[
            {"name":"Lucas", "score":"59"},
            {"name":"Bob", "score":"50"},
          ]
        }
			})
		);
    render(
			<MemoryRouter>
				<GoodBadBoard />
			</MemoryRouter>
		);
    element = document.getElementById('goodbad-test-content'); // 정의를 여기로 옮김
	});

	test('Testing rendering default people list on table', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(element).toHaveTextContent("John");
    expect(element).toHaveTextContent("Doe");
    expect(element).toHaveTextContent("Martin");
  
    expect(element).toHaveTextContent("95");
    expect(element).toHaveTextContent("90");
    expect(element).toHaveTextContent("97");

    // expect not to show up because Lucas is supposed to be in bottom board
    expect(element).not.toHaveTextContent("Lucas"); 
	});
  test('Testing clicking bottom button to render bottom people list', async () => {
    const bottomButton = screen.getByRole('button', { name: 'Bottom' });
    userEvent.click(bottomButton)

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3);
    })

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    expect(element).toHaveTextContent("Lucas");
    expect(element).toHaveTextContent("Bob");
  
    expect(element).toHaveTextContent("59");
    expect(element).toHaveTextContent("50");

    // expect not to show up because John is supposed to be in bottom board
    expect(element).not.toHaveTextContent("John"); 
	});

  test('Testing clicking top button to render top people list', async () => {
    const topButton = screen.getByRole('button', { name: 'Top' });
    userEvent.click(topButton)

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4);
    })

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    expect(element).toHaveTextContent("John");
    expect(element).toHaveTextContent("Doe");
    expect(element).toHaveTextContent("Martin");
  
    expect(element).toHaveTextContent("95");
    expect(element).toHaveTextContent("90");
    expect(element).toHaveTextContent("97");
	});
});
