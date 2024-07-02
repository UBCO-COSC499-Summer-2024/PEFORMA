import {fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServiceRoleList from '../../../app/frontend/src/JS/Department/ServiceRoleList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/AuthContext');

describe('ServiceRoleList', () => {
  let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {"currentPage":1, "perPage": 10, "rolesCount":13,
          roles:[
            { "id": 1, "name": "Undergrad Advisor", "department": "Testing 1", "description":"Some random testing"},
            { "id": 2, "name": "Grad Service Roller", "department":"C", "description":"Testing hello"},
            { "id": 3, "name": "Role 3", "department": "Dept 3", "description": "Description 3"},
            { "id": 4, "name": "Role 4", "department": "Dept 4", "description": "Description 4"},
            { "id": 5, "name": "Role 5", "department": "Dept 5", "description": "Description 5"},
            { "id": 6, "name": "Role 6", "department": "Dept 6", "description": "Description 6"},
            { "id": 7, "name": "Role 7", "department": "Dept 7", "description": "Description 7"},
            { "id": 8, "name": "Role 8", "department": "Dept 8", "description": "Description 8"},
            { "id": 9, "name": "Role 9", "department": "Dept 9", "description": "Description 9"},
            { "id": 10, "name": "Role 10", "department": "Dept 10", "description": "Description 10"},
            { "id": 11, "name": "Role 11", "department": "Dept 11", "description": "Description 11"},
            { "id": 12, "name": "Role 12", "department": "Dept 12", "description": "Description 12"},
            { "id": 13, "name": "Role 13", "department": "Dept 13", "description": "Description 13"},
          ]
        }
			})
		);
    render(
			<MemoryRouter>
				<ServiceRoleList />
			</MemoryRouter>
		);
    element = document.getElementById('dept-service-role-list-test-content');
	});

  test('Testing rendering with mock data service role list', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(element).toHaveTextContent("List of Serivce Roles (13 Active)");

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

  })
  
});