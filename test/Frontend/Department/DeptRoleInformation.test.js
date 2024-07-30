import {act, getByTestId, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptRoleInformation from '../../../app/frontend/src/JS/Department/DeptRoleInformation';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
useAuth.mockReturnValue({
  authToken: { token: 'mocked-token' },
  accountType: { accountType: 'mocked-accountType' },
});

function mockData() {
  axios.get.mockImplementation((url) => {
    if (url == 'http://localhost:3001/api/roleInfo') {
      return Promise.resolve({"data":{perPage: 5, currentPage: 1, roleID:1, assigneeCount:7, roleName:"Cheese", roleDescription: "Fish",
                                      department:"Computer Science", benchmark:0, latestYear:20234,
                                      assignees:[
                                        {instructorID: '12341234', name:"Mister Test1", year:2023},
                                        {instructorID: '12341235', name:"Mister Test2", year:2023},
                                        {instructorID: '12341236', name:"Mister Test3", year:2023},
                                        {instructorID: '12341237', name:"Mister Test4", year:2023},
                                        {instructorID: '12341238', name:"Mister Test5", year:2023},
                                        {instructorID: '12341239', name:"Mister Test6", year:2023}
                                      ]}});
    } else if (url == "http://localhost:3001/api/terms") {
      return Promise.resolve({"data": {currentTerm:20234}});
    }
  });
  return;
}

beforeEach(async() => {
  mockData();
  global.confirm = () => true;
  global.alert = jest.fn();
});


test('Checks if buttons exist', async () => {
    await act(async () => {
        render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>);
    });
    const buttons = await screen.getAllByRole('button');
    expect(buttons.length).toBe(6);
});

test('Checks if data is properly rendered', async () => {
    await act(async () => {
        ({ getByTestId } = render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>));
    });
    
    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i]).toBeDefined();
    }
});