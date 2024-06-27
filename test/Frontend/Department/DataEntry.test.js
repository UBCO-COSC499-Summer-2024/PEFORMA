import { act, render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DataEntry from '../../../app/frontend/src/JS/Department/DataEntry';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';

jest.mock('axios');
axios.get.mockResolvedValue({"data":{"instructors":[{}], instructorCount:0, perPage: 8, currentPage: 1}});

test('Checks if form appears properly', async () => {
    const user = userEvent.setup();
    let { getByTestId } = ""; 
    await act(async () => {
        ({getByTestId} = render(<MemoryRouter><DataEntry/></MemoryRouter>)); 
    });
    let newServiceRoleForm = screen.queryByTestId("service-role-form");
    expect(newServiceRoleForm).not.toBeInTheDocument(); // assert that form has NOT appeared yet
    const dropdown = screen.getByLabelText("Create New:");
    fireEvent.change(dropdown, {target: {value:"Service Role"}}); // Select from drop down to make form appear
    newServiceRoleForm = screen.getByTestId("service-role-form");
    const newCourseForm = screen.queryByTestId("course-form");
    expect(newServiceRoleForm).toBeInTheDocument(); // assert that form now exists and other form does not
    expect(newCourseForm).not.toBeInTheDocument();
    
});
