import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptMemberList from '../../../app/frontend/src/JS/Department/DeptMemberList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

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

describe('DeptMemberList', () => {
  let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'}
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {"currentPage":1, "perPage": 10, "membersCount":15,
          "members":[
            {"ubcid": 12312312, "name":"Kevin", "department": "Computer Science", "roleid":[1,10], "serviceRole":["RANDOM", "ROLEBRO"], "email":"abc@gmail.com", "status": true},
            {"ubcid": 22312122, "name":"David", "department": "Computer Science", "roleid":[2], "serviceRole":["DavidRole"], "email":"abc@gmail.com", "status": false},
            {"ubcid": 33331111, "name":"Lee", "department": "Physics", "roleid":[3], "serviceRole":["C"], "email":"aryujbc@gmail.com",  "status": true},
            {"ubcid": 41441411, "name":"Don", "department": "Mathmatics", "roleid":[4], "serviceRole":["C"], "email":"dfgh@gmail.com",  "status": true},
            {"ubcid": 55252525, "name":"Woo", "department": "Computer Science", "roleid":[5], "serviceRole":["C"], "email":"abcfgh@gmail.com",  "status": true},
            {"ubcid": 63434234, "name":"Amy", "department": "Computer Science", "roleid":[6], "serviceRole":["C"], "email":"abc@gmail.com",  "status": false},
            {"ubcid": 75346376, "name":"Olivia", "department": "Computer Science", "roleid":[2], "serviceRole":["C"], "email":"tysdkjm@gmail.com",  "status": true},
            {"ubcid": 35478655, "name":"Jest", "department": "Statistics", "roleid":[3], "serviceRole":["Coop"], "email":"abc@gmail.com",  "status": true},
            {"ubcid": 93452345, "name":"Min", "department": "Statistics", "roleid":[1], "serviceRole":["C"], "email":"aeur@gmail.com",  "status": false},
            {"ubcid": 10123121, "name":"Ko", "department": "Computer Science", "roleid":[5], "serviceRole":["Ca"], "email":"aert@gmail.com",  "status": true},
            {"ubcid": 10123121, "name":"Sang", "department": "Computer Science", "roleid":[10], "serviceRole":["CO"], "email":"asd@gmail.com",  "status": true},
            {"ubcid": 10123121, "name":"Brandon", "department": "Mathmatics", "roleid":[23], "serviceRole":["CP"], "email":"gsdfg@gmail.com",  "status": true},
            {"ubcid": 10123121, "name":"John", "department": "Computer Science", "roleid":[41], "serviceRole":["CA"], "email":"jtuy@gmail.com",  "status": true},
            {"ubcid": 11234234, "name":"Min", "department": "Statistics", "roleid":[21], "serviceRole":["CDD"], "email":"xfgj@gmail.com",  "status": false},
            {"ubcid": 12222123, "name":"Su", "department": "Computer Science", "roleid":[4], "serviceRole":["CR"], "email":"sdtghf@gmail.com",  "status": true}
          ]
        }
			})
		);
    render(
			<MemoryRouter>
				<DeptMemberList />
			</MemoryRouter>
		);
    element = document.getElementById('dept-member-list-test-content');
	});

  test('Testing rendering with mock data member list', async () => {
    // call axios.get once at a time
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // only 11 members out of 15 members are having true = 11 active
    expect(element).toHaveTextContent("List of Members (11 Active)"); 
    

    expect(element).toHaveTextContent("Kevin");
    expect(element).toHaveTextContent("Don");
    expect(element).toHaveTextContent("Woo");

    expect(element).not.toHaveTextContent("David"); // david is inactive member
    expect(element).not.toHaveTextContent("Amy"); // amy is inactive

    // second page data 
    expect(element).not.toHaveTextContent("Min"); 
    expect(element).not.toHaveTextContent("Su"); 
  });
  test('Test pagination in deptMemberList', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const paginationElement = element.querySelector('.pagination'); 
    expect(paginationElement).toBeInTheDocument();

    const nextPageButton = element.querySelector('.pagination .next a') || element.querySelector('.pagination li:last-child a');
    fireEvent.click(nextPageButton);

    await waitFor(() => { // now show only page 2 contents
      expect(element).toHaveTextContent("Su") // su is active and in second page

      // Kevin is in first page, so not.toHaveTextContext
      expect(element).not.toHaveTextContent("Kevin"); 

      expect(element).not.toHaveTextContent("Lee");
      expect(element).not.toHaveTextContent("Don");
    });
  });
  test('Test search bar in department member list', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    const searchInput = screen.getByPlaceholderText('Search member'); 
    fireEvent.change(searchInput, { target: { value: 'Jest' }});

    // Search by name Jest, only 1 row, data related jest will show up
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // 2 rows (Jest) + 1 row (<#><Course><Title><Description>) <- top default row

      expect(element).toHaveTextContent('Jest');
      expect(element).toHaveTextContent('35478655');
      expect(element).toHaveTextContent('Statistics');
      expect(element).toHaveTextContent('Coop');

      // woo and computer science are not present
      expect(element).not.toHaveTextContent('Woo');
      expect(element).not.toHaveTextContent('Computer Science');
    });
  });
  test('Testing sort button for name', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
  
    const sortButtons = document.querySelectorAll('.sort-button');
  
    // click for ascending order
    fireEvent.click(sortButtons[0]);
  
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      
      // save all ascending names ordered clicked by button
      const names = rows.slice(1).map(row => row.cells[0]?.textContent);

      // using sort function, copy a sorted name rows
      const sortedNamesAsc = [...names].sort();

      // check if names (button clicked) and sortedNames (used sort function) are equal
      expect(names).toEqual(sortedNamesAsc);
    });
  
    // click for descending order
    fireEvent.click(sortButtons[0]);
  
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      
      // save all descending names ordered clicked by button
      const names = rows.slice(1).map(row => row.cells[0]?.textContent);

      // reverse the name
      const sortedNamesDesc = [...names].sort().reverse();

      // check if both are equal
      expect(names).toEqual(sortedNamesDesc);
    });
  });
});