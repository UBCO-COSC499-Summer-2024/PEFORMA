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
            {"id": 1, "name":"Undergraduate Advisor", "department":"I dont know", "description":"Advises undergraduate students on academic matters", "status":true},
            {"id": 2, "name":"2", "department":"C", "description":"Testing", "status":true},
            {"id": 3, "name":"3", "department":"C", "description":"Testing", "status":false},
            {"id": 1, "name":"Random Role", "department":"C", "description":"Testing", "status":true},
            {"id": 2, "name":"5", "department":"C", "description":"Testing", "status":true},
            {"id": 6, "name":"Grad advisor", "department":"C", "description":"Testing", "status":true},
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
  
});