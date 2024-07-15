import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptStatusChangeServiceRole from '../../../app/frontend/src/JS/Department/DeptStatusChangeServiceRole';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('../../../app/frontend/src/JS/common/commonImports', () => ({
  __esModule: true,
  default: jest.fn(({ sideBarType }) => (
    <div>{`Mock Sidebar ${sideBarType}`}</div>
  )),
  CreateTopBar: jest.fn(({ onSearch }) => (
    <div className="topbar-search">
      <input type="text" placeholder="Search member" onChange={e => onSearch(e.target.value)} />
      <div className="logout">Logout</div>
    </div>
  )),
}));

describe('DeptStatusChangeServiceRole', () => {
  let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'}
		});

    // Mock useLocation to return state with memberData
    useLocation.mockReturnValue({
      state: {
        roleData: {"currentPage":1, "perPage": 10, "rolesCount":21,
          "roles":[
            {"id": 1, "name":"Undergraduate Advisor", "department":"I dont know", "description":"Advises undergraduate students on academic matters", "status":false},
            {"id": 2, "name":"2", "department":"C", "description":"Testing", "status":true},
            {"id": 3, "name":"3", "department":"C", "description":"Testing", "status":false},
            {"id": 1, "name":"Random Role", "department":"C", "description":"Testing", "status":true},
            {"id": 2, "name":"5", "department":"C", "description":"Testing", "status":true},
            {"id": 6, "name":"Grad advisor", "department":"computer science", "description":"some role advise grad students", "status":true},
            {"id": 5, "name":"7", "department":"C", "description":"Testing", "status":true},
            {"id": 7, "name":"First page role", "department":"C", "description":"Testing", "status":false},
            {"id": 4, "name":"9", "department":"C", "description":"Testing", "status":true},
            {"id": 6, "name":"10", "department":"C", "description":"Testing", "status":true},
            {"id": 8, "name":"11", "department":"C", "description":"Testing", "status":true},
            {"id": 6, "name":"12", "department":"C", "description":"Testing", "status":true},
            {"id": 3, "name":"Second page role", "department":"C", "description":"Testing", "status":true},
            {"id": 2, "name":"14", "department":"C", "description":"Testing", "status":true},
            {"id": 4, "name":"15", "department":"C", "description":"Testing", "status":false},
            {"id": 5, "name":"16", "department":"C", "description":"Testing", "status":false},
            {"id": 2, "name":"17", "department":"C", "description":"Testing", "status":false},
            {"id": 6, "name":"18", "department":"C", "description":"Testing", "status":true},
            {"id": 1, "name":"19", "department":"C", "description":"Testing", "status":true},
            {"id": 2, "name":"20", "department":"C", "description":"Testing", "status":false},
            {"id": 6, "name":"21", "department":"C", "description":"Testing", "status":true}
          ]
        }
      }
    });
    axios.post.mockResolvedValue({ status: 200 });
    render(
			<MemoryRouter>
				<DeptStatusChangeServiceRole />
			</MemoryRouter>
		);
    element = document.getElementById('role-status-change-test-content');
	});

  test('Testing rendering with mock data role data', async () => { 
    // expect to be 0 times called because its using location.state to receive datas 0 times of calling axios
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(0));
		await waitFor(() => {
      expect(element).toHaveTextContent("List of Serivce Roles (21 in Database)")
      // expect only first page members to be in screen
      expect(element).toHaveTextContent("Undergraduate Advisor");
      expect(element).toHaveTextContent("Grad advisor");
      expect(element).toHaveTextContent("Random Role");
      expect(element).toHaveTextContent("First page role");

      // expect not "Second page role" to have in first page because its a data aligns with second page
      expect(element).not.toHaveTextContent("Second page role");
    });
  });
  test('Check Active/Inactive button exists', async () => {
    await waitFor(() => {
        // Check if the element exists
        expect(element).toBeInTheDocument();

        // Check if "Active" button exists
        const activeButton = element.querySelector('button.active-button');
        const inactiveButton = element.querySelector('button.inactive-button');
        expect(activeButton).toBeInTheDocument();
        expect(inactiveButton).toBeInTheDocument();
    });
  });
  test('Testing status controller making True', async () => {
    await waitFor(() => {
      const rows = element.querySelectorAll('tbody tr');
      // expect length to be 10 rows
      expect(rows.length).toBe(10);

      // Find the row with the member's name "Undergraduate Advisor"
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Undergraduate Advisor')) {
              memberRow = row;
          }
      });
      // expect row Undergraduate Advisor contains right information
      expect(memberRow.textContent).toContain('Undergraduate Advisor');
      expect(memberRow.textContent).toContain('I dont know');
      expect(memberRow.textContent).toContain('Advises undergraduate students on academic matters');
      // expect row Undergraduate Advisor does not contains wrong information
      expect(memberRow.textContent).not.toContain('Random Role');

      // toggleButton is "Active" button
      const toggleButton = memberRow.querySelector('button:nth-child(1)');
      expect(toggleButton.textContent).toContain('Active'); // expect its active button

      // Undergraduate Advisor in mock data has False, inactive button should have disabled property (non clickable)
      const inactiveButton = memberRow.querySelector('button.inactive-button');
      expect(inactiveButton).toBeDisabled();

      // Click the active button
      fireEvent.click(toggleButton);

    });
    await waitFor(() => {
      // Request Undergraduate Advisor (roleId 1) status changing to true
      expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/api/DeptStatusChangeServiceRole',
          { roleId: 1, newStatus: true },
          { headers: { Authorization: 'Bearer mocked-token' } }
      );
    });
    await waitFor(() => {
      // Check if the status has been updated
      const rows = element.querySelectorAll('tbody tr');
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Undergraduate Advisor')) {
              memberRow = row;
          }
      });
      // Check if status changed to Active (checking active button has disabled property)
      const activeButton = memberRow.querySelector('button.active-button');
      expect(activeButton).toBeDisabled();
    });
  })
  test('Testing status controller making False', async () => {
    await waitFor(() => {
      const rows = element.querySelectorAll('tbody tr');
      // expect length to be 10 rows
      expect(rows.length).toBe(10);

      // Find the row with the member's name "Grad advisor"
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Grad advisor')) {
              memberRow = row;
          }
      });
      // expect row Grad advisor contains right information
      expect(memberRow.textContent).toContain('Grad advisor');
      expect(memberRow.textContent).toContain('computer science');
      expect(memberRow.textContent).toContain('some role advise grad students');
      // expect row Grad advisor does not contains wrong information
      expect(memberRow.textContent).not.toContain('Random Role');

      // toggleButton is "Inactive" button
      const toggleButton = memberRow.querySelector('button:nth-child(2)');
      expect(toggleButton.textContent).toContain('Inactive'); // expect its inactive button


      // Grad advisor has true, so active button should have disabled (it means button is not clickable)
      const activeButton = memberRow.querySelector('button.active-button');
      expect(activeButton).toBeDisabled();

      // Click the inactive button
      fireEvent.click(toggleButton);

    });

    await waitFor(() => {
      // Request Grad advisor status changing to false
      expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/api/DeptStatusChangeServiceRole',
          { roleId: 6, newStatus: false },
          { headers: { Authorization: 'Bearer mocked-token' } }
      );
    });

    await waitFor(() => {
      // Check again after request
      const rows = element.querySelectorAll('tbody tr');
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Grad advisor')) {
              memberRow = row;
          }
      });
      // deactive is requested, so inative button is not having disabled property making button unclickable
      const inactiveButton = memberRow.querySelector('button.inactive-button');
      expect(inactiveButton).toBeDisabled();
    });
  });
});