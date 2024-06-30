import {act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoleInformation from '../../../app/frontend/src/JS/Department/RoleInformation';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';

jest.mock('axios');

axios.get.mockImplementation((url) => {
    switch (url) {
      case 'http://localhost:3000/assignees.json':
        return Promise.resolve({"data":{"assignees":[{}], assigneeCount:0, perPage: 5, currentPage: 1}});
      case 'http://localhost:3000/assignInstructors.json':
        return Promise.resolve({"data": {"instructors":[{}], instructorCount:0, perPage: 8, currentPage: 1}});
      default:
        return Promise.reject(new Error('not found'));
    }
  })

test('Checks if buttons exist', async () => {
    await act(async () => {
        render(<MemoryRouter><RoleInformation/></MemoryRouter>);
    });
    const buttons = await screen.getAllByRole('button');
    expect(buttons.length).toBe(5);
});
test('Checks if data exists', async () => {
    await act(async () => {
        render(<MemoryRouter><RoleInformation/></MemoryRouter>);
    });
    
    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i]).toBeDefined();
    }
});