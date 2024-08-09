import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminStatusChangeMember from '../../../app/frontend/src/JS/Admin/AdminStatusChangeMember';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mocking axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-router-dom', () => ({ // mocking useLocation for receiving state
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('AdminStatusChangeMember', () => {
  let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});

    // Mock useLocation to return state with memberData
    useLocation.mockReturnValue({
      state: {
        memberData: {
          members: [
            { "ubcid": 35673567, "name": "Lee", "department": "Computer Science", "roleid": [1, 10], "serviceRole": ["RANDOM", "ROLEBRO"], "email": "dfgh@gmail.com", "status": true },
            { "ubcid": 46776955, "name": "Kim", "department": "Statistics", "roleid": [2], "serviceRole": ["Advisor"], "email": "cghnm@gmail.com", "status": false },
            { "ubcid": 89078906, "name": "Lim", "department": "Physics", "roleid": [3], "serviceRole": ["C"], "email": "aerg@gmail.com", "status": false },
            { "ubcid": 35683567, "name": "Seo", "department": "Computer Science", "roleid": [1, 10], "serviceRole": ["A"], "email": "zxdfgb@gmail.com", "status": true },
            { "ubcid": 89089780, "name": "Jung", "department": "Computer Science", "roleid": [2], "serviceRole": ["B"], "email": "aerg@gmail.com", "status": false },
            { "ubcid": 34567357, "name": "Sim", "department": "Physics", "roleid": [3], "serviceRole": ["D"], "email": "gbtfb@gmail.com", "status": true },
            { "ubcid": 23547834, "name": "Jang", "department": "Mathmatics", "roleid": [1, 10], "serviceRole": ["E"], "email": "giuyk@gmail.com", "status": true },
            { "ubcid": 23095734, "name": "Su", "department": "Computer Science", "roleid": [2], "serviceRole": ["Assistant"], "email": "cvbmn@gmail.com", "status": true },
            { "ubcid": 34582345, "name": "Kang", "department": "Physics", "roleid": [3], "serviceRole": ["QQQQQ"], "email": "stryh@gmail.com", "status": true },
            { "ubcid": 24598235, "name": "Hyun", "department": "Mathmatics", "roleid": [1, 10], "serviceRole": ["WWWWW"], "email": "sgfdh@gmail.com", "status": true },
            { "ubcid": 35420683, "name": "Ji", "department": "Statistics", "roleid": [2], "serviceRole": ["ERERER"], "email": "ncghn@gmail.com", "status": false },
            { "ubcid": 23423402, "name": "Bin", "department": "Physics", "roleid": [3], "serviceRole": ["CCCDDD"], "email": "asdsfdgh@gmail.com", "status": true },
            { "ubcid": 35487621, "name": "Sin", "department": "Statistics", "roleid": [1, 10], "serviceRole": ["LLLLL"], "email": "azdfg@gmail.com", "status": true },
            { "ubcid": 54908654, "name": "Woong", "department": "Computer Science", "roleid": [2], "serviceRole": ["MMMMM"], "email": "dtujm@gmail.com", "status": false },
            { "ubcid": 34123834, "name": "Oh", "department": "Statistics", "roleid": [3], "serviceRole": ["PLPLPL"], "email": "aerg@gmail.com", "status": true },
          ],
          membersCount: 15,
          perPage: 10,
          currentPage: 1,
        }
      }
    });
    axios.post.mockResolvedValue({ status: 200 }); // set status to 200 for axios.post
    render(
			<MemoryRouter>
				<AdminStatusChangeMember />
			</MemoryRouter>
		);
    element = document.getElementById('admin-status-controller-test-content');
	});

  test('Testing rendering with mock data member list', async () => { 
    // expect to be 1 time called because its using location.state to receive data 0 time of calling axios (except topbar is calling 1 axios.get)
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(0));
		await waitFor(() => {
      expect(element).toHaveTextContent("List of Members (15 in Database)")
      // expect only first page members to be in screen
      expect(element).toHaveTextContent("Jang");
      expect(element).toHaveTextContent("Sim");
      expect(element).toHaveTextContent("Seo");
      expect(element).toHaveTextContent("Lee");
      expect(element).toHaveTextContent("Kim"); 

      // expect not "Oh" to have in first page because its a data aligns with second page
      expect(element).not.toHaveTextContent("Oh");
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

      // Find the row with the member's name "Kim"
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Kim')) {
              memberRow = row;
          }
      });
      // expect row Kim contains right information
      expect(memberRow.textContent).toContain('Kim');
      expect(memberRow.textContent).toContain('46776955');
      expect(memberRow.textContent).toContain('Advisor');
      // expect row Kim does not contains wrong information
      expect(memberRow.textContent).not.toContain('Lee');

      // toggleButton is "Active" button
      const toggleButton = memberRow.querySelector('button:nth-child(1)');
      expect(toggleButton.textContent).toContain('Active'); // expect its active button

      // Kim in mock data has False, inactive button should have disabled property (non clickable)
      const inactiveButton = memberRow.querySelector('button.inactive-button');
      expect(inactiveButton).toBeDisabled();

      // Click the active button
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      // Request kim status changing to true
      expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/api/adminStatusChangeMembers',
          { memberId: 46776955, newStatus: true },
          { headers: { Authorization: 'Bearer mocked-token' } }
      );
    });

    await waitFor(() => {
      // Check if the status has been updated
      const rows = element.querySelectorAll('tbody tr');
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Kim')) {
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
  
      // Find the row with the member's name "Su"
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Su')) {
              memberRow = row;
          }
      });

      // expect row Su contains right information
      expect(memberRow.textContent).toContain('Su');
      expect(memberRow.textContent).toContain('23095734');
      expect(memberRow.textContent).toContain('Assistant');
      // expect row Su does not contains wrong information
      expect(memberRow.textContent).not.toContain('Kim');
  
      // toggleButton is "Inactive" button
      const toggleButton = memberRow.querySelector('button:nth-child(2)');
      expect(toggleButton.textContent).toContain('Inactive'); // expect its inactive button
  
      // Su has true, so active button should have disabled (it means button is not clickable)
      const activeButton = memberRow.querySelector('button.active-button');
      expect(activeButton).toBeDisabled();

      // Click the inactive button
      fireEvent.click(toggleButton);
    });
  
    await waitFor(() => {
      // Request su status changing to false
      expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/api/adminStatusChangeMembers',
          { memberId: 23095734, newStatus: false },
          { headers: { Authorization: 'Bearer mocked-token' } }
      );
    });
  
    await waitFor(() => {
      // Check again after request
      const rows = element.querySelectorAll('tbody tr');
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('Su')) {
              memberRow = row;
          }
      });
      
      // deactive is requested, so inative button is not having disabled property making button unclickable
      const inactiveButton = memberRow.querySelector('button.inactive-button');
      expect(inactiveButton).toBeDisabled();
    });
  });
});
