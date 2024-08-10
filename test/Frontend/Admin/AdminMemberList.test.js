import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminMemberList from '../../../app/frontend/src/JS/Admin/AdminMemberList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mocking axios and useAuth modules
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

// mocking sidebar
jest.mock('../../../app/frontend/src/JS/common/SideBar.js', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mock Sidebar</div>),
}));

// mocking topbar for testing search function
jest.mock('../../../app/frontend/src/JS/common/TopBar.js', () => ({
  __esModule: true,
  default: jest.fn(({ onSearch }) => (
    <div className="topbar-search">
      <input type="text" placeholder="Search member" onChange={e => onSearch(e.target.value)} />
      <div className="logout">Logout</div>
    </div>
  )),
}));

describe('AdminMemberList', () => {
  let element; 

	beforeEach(() => { // setup function to run before each test
		useAuth.mockReturnValue({ // mock token and profileId
			authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'}
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {"currentPage":1, "perPage": 10, "membersCount":25,
          "members":[
            {"ubcid": 12312312, "name":"Kevin", "department": "Computer Science", "roleid":[1,10], "serviceRole":["RANDOM", "ROLEBRO"], "email":"abc@gmail.com", "status": true},
            {"ubcid": 22312122, "name":"David", "department": "Computer Science", "roleid":[2], "serviceRole":["DavidRole"], "email":"abc@gmail.com", "status": false},
            {"ubcid": 33331111, "name":"TEST", "department": "Physics", "roleid":[3], "serviceRole":["C"], "email":"aryujbc@gmail.com",  "status": true},
            {"ubcid": 41441411, "name":"ASD", "department": "Mathmatics", "roleid":[4], "serviceRole":["C"], "email":"dfgh@gmail.com",  "status": true},
            {"ubcid": 55252525, "name":"TestRow5", "department": "Statistics", "roleid":[5], "serviceRole":["C"], "email":"abcfgh@gmail.com",  "status": true},
            {"ubcid": 63434234, "name":"6=WETJI", "department": "Computer Science", "roleid":[6], "serviceRole":["C"], "email":"abc@gmail.com",  "status": false},
            {"ubcid": 75346376, "name":"Random", "department": "Computer Science", "roleid":[2], "serviceRole":["C"], "email":"tysdkjm@gmail.com",  "status": true},
            {"ubcid": 35478655, "name":"ADPROHN", "department": "Statistics", "roleid":[3], "serviceRole":["C"], "email":"abc@gmail.com",  "status": true},
            {"ubcid": 93452345, "name":"TestingRow9", "department": "Statistics", "roleid":[1], "serviceRole":["C"], "email":"aeur@gmail.com",  "status": false},
            {"ubcid": 10123121, "name":"10", "department": "Computer Science", "roleid":[5], "serviceRole":["C"], "email":"aert@gmail.com",  "status": true},
            {"ubcid": 11234234, "name":"SecondPageData", "department": "Computer Science", "roleid":[7], "serviceRole":["C"], "email":"xfgj@gmail.com",  "status": false},
            {"ubcid": 12222123, "name":"1WE4TRJ[", "department": "Computer Science", "roleid":[4], "serviceRole":["C"], "email":"sdtghf@gmail.com",  "status": true}
          ]
        }
			})
		);
    render( // render AdminMemberList
			<MemoryRouter>
				<AdminMemberList />
			</MemoryRouter>
		);
    element = document.getElementById('admin-member-list-test-content');
	});

  test('Testing rendering with mock data course list', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1)); // expect axios.get called one time

    // only 8 members out of 12 members are having true = 8 active
    expect(element).toHaveTextContent("List of Members (8 Active)"); 
    
    expect(element).toHaveTextContent("Kevin");
    expect(element).toHaveTextContent("David");
    expect(element).toHaveTextContent("TestRow5");
    expect(element).toHaveTextContent("6=WETJI");
    expect(element).toHaveTextContent("TestingRow9");

    expect(element).not.toHaveTextContent("Shouldntbeinthetest"); //no data in mock

    // to show if stats and !status filter working well
    expect(element).toHaveTextContent("Active");
    expect(element).toHaveTextContent("Inactive");

    // second page data 
    expect(element).not.toHaveTextContent("SecondPageData"); 
    expect(element).not.toHaveTextContent("1WE4TRJ["); 
  });
  test('Test pagination works', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const paginationElement = element.querySelector('.pagination');  // find pagination
    expect(paginationElement).toBeInTheDocument();

    const nextPageButton = element.querySelector('.pagination .next a') || element.querySelector('.pagination li:last-child a');
    fireEvent.click(nextPageButton);

    await waitFor(() => { // now show only page 2 contents
      expect(element).toHaveTextContent("SecondPageData");
      expect(element).toHaveTextContent("1WE4TRJ[");

      // Kevin is in first page, so not.toHaveTextContext
      expect(element).not.toHaveTextContent("Kevin"); 

      expect(element).not.toHaveTextContent("RANDOM");
      expect(element).not.toHaveTextContent("ROLEBRO");
    });
  });
  test('Test search bar in member list', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    const searchInput = screen.getByPlaceholderText('Search member'); 
    fireEvent.change(searchInput, { target: { value: 'Kevin' }});

    // Search by name Kevin, only 1 row, data related Kevin will show up
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // 2 rows (Kevin) + 1 row (<#><Course><Title><Description>) <- top default row

      expect(element).toHaveTextContent('Kevin');
      expect(element).toHaveTextContent('12312312');
      expect(element).toHaveTextContent('RANDOM');
      expect(element).toHaveTextContent('ROLEBRO');
      expect(element).toHaveTextContent('Active');

      // David, DavidRole, David stauts will not be present
      expect(element).not.toHaveTextContent('David');
      expect(element).not.toHaveTextContent('DavidRole');
      expect(element).not.toHaveTextContent('Inactive');
    });
  })
});