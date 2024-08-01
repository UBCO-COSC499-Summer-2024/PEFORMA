import { fireEvent, render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptMemberList from '../../../app/frontend/src/JS/Department/DeptMemberList';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import * as utils from '../../../app/frontend/src/JS/common/utils';

// Mock axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

// Mocking sidebar
jest.mock('../../../app/frontend/src/JS/common/SideBar.js', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mock Sidebar</div>),
}));

// Mocking topbar for testing search function
jest.mock('../../../app/frontend/src/JS/common/TopBar.js', () => ({
  __esModule: true,
  default: jest.fn(({ onSearch }) => (
    <div className="topbar-search">
      <input type="text" placeholder="Search member" onChange={e => onSearch(e.target.value)} />
      <div className="logout">Logout</div>
    </div>
  )),
}));

jest.mock('../../../app/frontend/src/JS/common/utils', () => ({
  ...jest.requireActual('../../../app/frontend/src/JS/common/utils'),
  downloadCSV: jest.fn(),
}));

describe('DeptMemberList', () => {
  let element;

  beforeEach(async () => {
    useAuth.mockReturnValue({
      // Mock authToken
      authToken: { token: 'mocked-token' },
    });

    axios.get.mockImplementation(() =>
      Promise.resolve({
        // Mock data
        data: {
          currentPage: 1,
          perPage: 10,
          membersCount: 15,
          currentTerm: 20244,
          members: [
            {
              ubcid: 12312312,
              name: 'Kevin',
              department: 'Computer Science',
              roleid: [1, 10],
              serviceRole: ['RANDOM', 'ROLEBRO'],
              email: 'abc@gmail.com',
              status: true,
            },
            {
              ubcid: 22312122,
              name: 'David',
              department: 'Computer Science',
              roleid: [2],
              serviceRole: ['DavidRole'],
              email: 'abc@gmail.com',
              status: false,
            },
            {
              ubcid: 33331111,
              name: 'Lee',
              department: 'Physics',
              roleid: [3],
              serviceRole: ['C'],
              email: 'aryujbc@gmail.com',
              status: true,
            },
            {
              ubcid: 41441411,
              name: 'Don',
              department: 'Mathmatics',
              roleid: [4],
              serviceRole: ['C'],
              email: 'dfgh@gmail.com',
              status: true,
            },
            {
              ubcid: 55252525,
              name: 'Woo',
              department: 'Computer Science',
              roleid: [5],
              serviceRole: ['C'],
              email: 'abcfgh@gmail.com',
              status: true,
            },
            {
              ubcid: 63434234,
              name: 'Amy',
              department: 'Computer Science',
              roleid: [6],
              serviceRole: ['C'],
              email: 'abc@gmail.com',
              status: false,
            },
            {
              ubcid: 75346376,
              name: 'Olivia',
              department: 'Computer Science',
              roleid: [2],
              serviceRole: ['C'],
              email: 'tysdkjm@gmail.com',
              status: true,
            },
            {
              ubcid: 35478655,
              name: 'Jest',
              department: 'Statistics',
              roleid: [3],
              serviceRole: ['Coop'],
              email: 'abc@gmail.com',
              status: true,
            },
            {
              ubcid: 93452345,
              name: 'Min',
              department: 'Statistics',
              roleid: [1],
              serviceRole: ['C'],
              email: 'aeur@gmail.com',
              status: false,
            },
            {
              ubcid: 10123121,
              name: 'Ko',
              department: 'Computer Science',
              roleid: [5],
              serviceRole: ['Ca'],
              email: 'aert@gmail.com',
              status: true,
            },
            {
              ubcid: 10123121,
              name: 'Sang',
              department: 'Computer Science',
              roleid: [10],
              serviceRole: ['CO'],
              email: 'asd@gmail.com',
              status: true,
            },
            {
              ubcid: 10123121,
              name: 'Brandon',
              department: 'Mathmatics',
              roleid: [23],
              serviceRole: ['CP'],
              email: 'gsdfg@gmail.com',
              status: true,
            },
            {
              ubcid: 10123121,
              name: 'John',
              department: 'Computer Science',
              roleid: [41],
              serviceRole: ['CA'],
              email: 'jtuy@gmail.com',
              status: true,
            },
            {
              ubcid: 11234234,
              name: 'Min',
              department: 'Statistics',
              roleid: [21],
              serviceRole: ['CDD'],
              email: 'xfgj@gmail.com',
              status: false,
            },
            {
              ubcid: 12222123,
              name: 'Su',
              department: 'Computer Science',
              roleid: [4],
              serviceRole: ['CR'],
              email: 'sdtghf@gmail.com',
              status: true,
            },
          ],
        },
      })
    );

    await act(async () => {
      render(
        // Render DeptMemberList
        <MemoryRouter>
          <DeptMemberList />
        </MemoryRouter>
      );
    });

    element = document.getElementById('dept-member-list-test-content'); // Set element with id
  });

  test('Testing rendering with mock data member list', async () => {
    // Call axios.get once at a time
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Only 11 members out of 15 members have true status = 11 active
    expect(element).toHaveTextContent('List of Members (11 Active)');

    // Expect element to have Kevin, Don, Woo
    expect(element).toHaveTextContent('Kevin');
    expect(element).toHaveTextContent('Don');
    expect(element).toHaveTextContent('Woo');

    expect(element).not.toHaveTextContent('David'); // David is an inactive member
    expect(element).not.toHaveTextContent('Amy'); // Amy is inactive

    // Second page data 
    expect(element).not.toHaveTextContent('Min');
    expect(element).not.toHaveTextContent('Su');
  });

  test('Test pagination in deptMemberList', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const paginationElement = element.querySelector('.pagination'); // Find pagination
    expect(paginationElement).toBeInTheDocument();

    const nextPageButton = element.querySelector('.pagination .next a') || element.querySelector('.pagination li:last-child a'); // Find next page button
    await act(async () => {
      fireEvent.click(nextPageButton); // Simulate clicking next button
    });

    await waitFor(() => { // Now show only page 2 contents
      expect(element).toHaveTextContent('Su'); // Su is active and on the second page

      // Kevin is on the first page, so not.toHaveTextContent
      expect(element).not.toHaveTextContent('Kevin');

      expect(element).not.toHaveTextContent('Lee');
      expect(element).not.toHaveTextContent('Don');
    });
  });

  test('Test search bar in department member list', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    const searchInput = screen.getByPlaceholderText('Search member'); // Find search box with placeholder 'Search member'
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Jest' } }); // Search Jest
    });

    // Search by name Jest, only 1 row, data related jest will show up
    await waitFor(() => {
      const rows = screen.getAllByRole('row');

      expect(element).toHaveTextContent('Jest');
      expect(element).toHaveTextContent('35478655');
      expect(element).toHaveTextContent('Statistics');
      expect(element).toHaveTextContent('Coop');

      // Woo and computer science are not present
      expect(element).not.toHaveTextContent('Woo');
      expect(element).not.toHaveTextContent('Computer Science');
    });
  });

  test('Testing sort button for name', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));

    const sortButtons = document.querySelectorAll('.sort-button'); // Find sort button 

    // Click for ascending order
    await act(async () => {
      fireEvent.click(sortButtons[0]);
    });
    await waitFor(() => {
      const rows = screen.getAllByRole('row').filter(row => row.parentNode.tagName === 'tbody'); // Only getting from tbody

      // Save all ascending names ordered clicked by button
      const names = rows.slice(1).map(row => row.cells[0]?.textContent);

      // Using sort function, copy a sorted name rows
      const sortedNamesAsc = [...names].sort();

      // Check if names (button clicked) and sortedNames (used sort function) are equal
      expect(names).toEqual(sortedNamesAsc);
    });

    // Click for descending order
    await act(async () => {
      fireEvent.click(sortButtons[0]);
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row').filter(row => row.parentNode.tagName === 'tbody'); // Only getting from tbody

      // Save all descending names ordered clicked by button
      const names = rows.slice(1).map(row => row.cells[0]?.textContent);

      // Reverse the name
      const sortedNamesDesc = [...names].sort().reverse();

      // Check if both are equal
      expect(names).toEqual(sortedNamesDesc);
    });
  });

  test('Test export functionality', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(5));

    // Mock current term
    const mockCurrentTerm = '2024 Summer Term 2';

    // Find and click the export button using its class name
    const exportButton = element.querySelector('.icon-button');
    await act(async () => {
      fireEvent.click(exportButton);
    });

    // Check if downloadCSV was called with the correct arguments
    expect(utils.downloadCSV).toHaveBeenCalledWith(
      '#, Name, UBC ID, Service Role, Department, Email, Status\n' +
      '1,Kevin,12312312,"RANDOM; ROLEBRO",Computer Science,abc@gmail.com,Active\n' +
      '2,David,22312122,"DavidRole",Computer Science,abc@gmail.com,Inactive\n' +
      '3,Lee,33331111,"C",Physics,aryujbc@gmail.com,Active\n' +
      '4,Don,41441411,"C",Mathmatics,dfgh@gmail.com,Active\n' +
      '5,Woo,55252525,"C",Computer Science,abcfgh@gmail.com,Active\n' +
      '6,Amy,63434234,"C",Computer Science,abc@gmail.com,Inactive\n' +
      '7,Olivia,75346376,"C",Computer Science,tysdkjm@gmail.com,Active\n' +
      '8,Jest,35478655,"Coop",Statistics,abc@gmail.com,Active\n' +
      '9,Min,93452345,"C",Statistics,aeur@gmail.com,Inactive\n' +
      '10,Ko,10123121,"Ca",Computer Science,aert@gmail.com,Active\n' +
      '11,Sang,10123121,"CO",Computer Science,asd@gmail.com,Active\n' +
      '12,Brandon,10123121,"CP",Mathmatics,gsdfg@gmail.com,Active\n' +
      '13,John,10123121,"CA",Computer Science,jtuy@gmail.com,Active\n' +
      '14,Min,11234234,"CDD",Statistics,xfgj@gmail.com,Inactive\n' +
      '15,Su,12222123,"CR",Computer Science,sdtghf@gmail.com,Active\n',
      `${mockCurrentTerm} Members List.csv`
    );
  });
});