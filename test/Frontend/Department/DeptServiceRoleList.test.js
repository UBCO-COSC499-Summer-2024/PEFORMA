import {fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptServiceRoleList from '../../../app/frontend/src/JS/Department/DeptServiceRoleList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mock axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('DeptServiceRoleList', () => {
  let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({ // mock authToken
			authToken: { token: 'mocked-token' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({ // mock data
				data: {"currentPage":1, "perPage": 10, "rolesCount":13,
          roles:[
            { "id": 1, "name": "Undergrad Advisor", "department": "Testing 1", "description":"Some random testing", "status":true},
            { "id": 2, "name": "Grad Service Roller", "department":"C", "description":"Testing hello", "status":true},
            { "id": 3, "name": "Role 3", "department": "Dept 3", "description": "Description 3", "status":true},
            { "id": 4, "name": "Role 4", "department": "Dept 4", "description": "Description 4", "status":true},
            { "id": 5, "name": "Role 5", "department": "Dept 5", "description": "Description 5", "status":true},
            { "id": 6, "name": "Role 6", "department": "Dept 6", "description": "Description 6", "status":false},
            { "id": 7, "name": "Role 7", "department": "Dept 7", "description": "Description 7", "status":true},
            { "id": 8, "name": "Role 8", "department": "Dept 8", "description": "Description 8", "status":true},
            { "id": 9, "name": "Role 9", "department": "Dept 9", "description": "Description 9", "status":false},
            { "id": 10, "name": "Role 10", "department": "Dept 10", "description": "Description 10", "status":true},
            { "id": 11, "name": "Role 11", "department": "Dept 11", "description": "Description 11", "status":true},
            { "id": 12, "name": "Role 12", "department": "Dept 12", "description": "Description 12", "status":false},
            { "id": 13, "name": "Role 13", "department": "Dept 13", "description": "Description 13", "status":false},
          ]
        }
			})
		);
    render( // render DeptServiceRoleList
			<MemoryRouter>
				<DeptServiceRoleList />
			</MemoryRouter>
		);
    element = document.getElementById('dept-service-role-list-test-content'); // set element with id
	});

  test('Testing rendering with mock data service role list', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(element).toHaveTextContent("List of Service Roles (9 Active)"); // expect header to be same

    // check it renders mock data well
    expect(element).toHaveTextContent("Role");
    expect(element).toHaveTextContent("Department");
    expect(element).toHaveTextContent("Description");

    expect(element).toHaveTextContent("Undergrad Advisor");
    expect(element).toHaveTextContent("Testing 1");
    expect(element).toHaveTextContent("Some random testing");
    
    expect(element).toHaveTextContent("Grad Service Roller");
    expect(element).toHaveTextContent("C");
    expect(element).toHaveTextContent("Testing hello");

    expect(element).toHaveTextContent("Role 10");

    expect(element).toHaveTextContent("Active");
    expect(element).toHaveTextContent("Inactive");

  })
  test('Testing mock datas id after 11 not to show on first page', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    expect(element).toHaveTextContent("Dept 10");

    // Role 11, Dept 11, Description 11 are in second page so expect.not
    expect(element).not.toHaveTextContent("Role 11");
    expect(element).not.toHaveTextContent("Dept 11");
    expect(element).not.toHaveTextContent("Description 11");
  })
  
  test('Testing pagination', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    const paginationElement = element.querySelector('.pagination'); // find pagination
    expect(paginationElement).toBeInTheDocument(); // expect pagination to be exist

    const firstPageRows = element.querySelectorAll('tbody tr'); // find first page rows
    expect(firstPageRows.length).toBe(10); // expect rows length are 10 

    const nextPageButton = element.querySelector('.pagination .next a') || element.querySelector('.pagination li:last-child a'); // find nextPage button
    fireEvent.click(nextPageButton); // simulate clicking next page button

    await waitFor(() => { // check next page
      expect(element).not.toHaveTextContent("Role 7"); // role 7 is in first page
      expect(element).toHaveTextContent("Role 11");
      expect(element).toHaveTextContent("Role 12");
      expect(element).toHaveTextContent("Role 13");

      expect(element).not.toHaveTextContent("Dept 4"); // dept 4 is in first page
      expect(element).toHaveTextContent("Dept 11");
      expect(element).toHaveTextContent("Dept 12");
      expect(element).toHaveTextContent("Dept 13");
    })

    const prevPageButton = element.querySelector('.pagination .prev a') || element.querySelector('.pagination li:first-child a'); // find prev page button
    fireEvent.click(prevPageButton); // simulate clicking prev page button

    await waitFor(() => { // check going back to prev page
      expect(element).not.toHaveTextContent("Role 12");
      expect(element).not.toHaveTextContent("Dept 12");
      expect(element).not.toHaveTextContent("Description 12");

      // now expect Role 5 appears in first page as its first page data
      expect(element).toHaveTextContent("Role 5");
    })
  })
  test('Testing filledRoles function is working', async () => {
    const nextPageButton = element.querySelector('.pagination .next a'); 
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      /* 
      13 total roles, so second page will have 3 courses left, however checking
      filledRoles which will make total 10 rows
      */
      const isFilledSecondPage = element.querySelectorAll('tbody tr');
      expect(isFilledSecondPage.length).toBe(10);
    })
  })
});