/*
import { act, render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DataEntry from '../../../app/frontend/src/JS/Department/DataEntry';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/AuthContext');
useAuth.mockReturnValue({
  profileId: 'mocked-profileId',
});

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
*/

import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DataEntryComponent from '../../../app/frontend/src/JS/Department/DeptDataEntry';
import { MemoryRouter } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
useAuth.mockReturnValue({
  authToken: { token: 'mocked-token' },
  accountType: { accountType: 'mocked-accountType' },
  profileId: { profileId: 'mocked-profileId'},
});
axios.get.mockResolvedValue({
  "data": {
    "instructors": [{}], 
    "instructorCount": 0, 
    "perPage": 8, 
    "currentPage": 1
  }
});

test('表单在选择后正确显示', async () => {
  const user = userEvent.setup();
  await act(async () => {
    render(
      <MemoryRouter>
        <DataEntryComponent />
      </MemoryRouter>
    );
  });

  // 检查表单最初没有显示
  let serviceRoleForm = screen.queryByTestId("service-role-form");
  let courseForm = screen.queryByTestId("course-form");
  expect(serviceRoleForm).not.toBeInTheDocument();
  expect(courseForm).not.toBeInTheDocument();

  // 模拟从下拉菜单中选择“Service Role”
  const dropdown = screen.getByLabelText("Create New:");
  fireEvent.change(dropdown, { target: { value: "Service Role" } });

  // 检查“Service Role”表单是否显示
  serviceRoleForm = screen.getByTestId("service-role-form");
  courseForm = screen.queryByTestId("course-form");
  expect(serviceRoleForm).toBeInTheDocument();
  expect(courseForm).not.toBeInTheDocument();

  // 模拟从下拉菜单中选择“Course”
  fireEvent.change(dropdown, { target: { value: "Course" } });

  // 检查“Course”表单是否显示
  serviceRoleForm = screen.queryByTestId("service-role-form");
  courseForm = screen.getByTestId("course-form");
  expect(serviceRoleForm).not.toBeInTheDocument();
  expect(courseForm).toBeInTheDocument();
});
