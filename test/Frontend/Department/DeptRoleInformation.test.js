import {act, render, screen, waitFor } from '@testing-library/react';
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

axios.get.mockImplementation((url) => {
    if (url == 'http://localhost:3000/assignees.json' || url == 'http://localhost:3001/api/roleInfo') {
      return Promise.resolve({"data":{"assignees":[{}], assigneeCount:0, perPage: 5, currentPage: 1}});
    } else {
      return Promise.resolve({"data": {"instructors":[{}], instructorCount:0, perPage: 8, currentPage: 1}});
    }
  });

test('Checks if buttons exist', async () => {
    await act(async () => {
        render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>);
    });
    const buttons = await screen.getAllByRole('button');
    expect(buttons.length).toBe(4);
});
test('Checks if data exists', async () => {
    await act(async () => {
        render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>);
    });
    
    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i]).toBeDefined();
    }
});