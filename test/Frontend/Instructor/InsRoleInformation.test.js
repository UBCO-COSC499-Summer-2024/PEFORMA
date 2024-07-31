import {act, render, screen} from '@testing-library/react';

import '@testing-library/jest-dom';
import InsRoleInformation from '../../../app/frontend/src/JS/Instructor/InsRoleInformation';
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
  axios.get.mockImplementation(()=>{
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
  });
}

beforeEach(async() => {
  mockData();
  global.confirm = () => true;
  global.alert = jest.fn();
});

test('Checks if data is properly rendered', async () => {
    await act(async () => {
        render(<MemoryRouter><InsRoleInformation/></MemoryRouter>);
    });
    const main = screen.getByTestId("ri-main");
    expect(main).toHaveTextContent("Cheese");
    expect(main).toHaveTextContent("Fish");
    expect(main).toHaveTextContent("Computer Science");
});

