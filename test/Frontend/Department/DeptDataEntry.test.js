import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
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
axios.post.mockResolvedValue("MOCK");

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

test('Checks for backend request after submitting the form', async() => {
  const user = userEvent.setup();
  global.confirm = () => true;
  await act(async () => {
    render(
      <MemoryRouter>
        <DataEntryComponent />
      </MemoryRouter>
    );
  });
  // Fill in all required fields
  const dropdown = screen.getByLabelText("Create New:");
  fireEvent.change(dropdown, { target: { value: "Course" } });
  const title = screen.getByPlaceholderText("Enter course title");
  await fireEvent.change(title, {target: {value:"Cheese"}});
  const dept = screen.getByLabelText("Department:");
  await fireEvent.change(dept, { target: {value: "COSC"}});
  const coursecode = screen.getByLabelText("Course Code:");
  await fireEvent.change(coursecode, {target: {value:"111"}});
  const desc = screen.getByLabelText("Course Description:");
  await fireEvent.change(desc, {target:{value:"TEST"}});
  const finish = screen.getByLabelText("Finish");
  // Click the finish button
  await user.click(finish);
  // Check the correct axios post request was called
  await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/enter', expect.anything()));
});

test('Checks form validation', async() => {
  const user = userEvent.setup();
  global.alert = jest.fn();
  global.confirm = () => true;
  await act(async () => {
    render(
      <MemoryRouter>
        <DataEntryComponent />
      </MemoryRouter>
    );
  });
  // Fill in all required fields
  const dropdown = screen.getByLabelText("Create New:");
  fireEvent.change(dropdown, { target: { value: "Course" } });
  const title = screen.getByPlaceholderText("Enter course title");
  // Use a 110 character long string (max is 100)
  await fireEvent.change(title, {target: {value:
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"+
    "1234567890"
  }});
  const dept = screen.getByLabelText("Department:");
  await fireEvent.change(dept, { target: {value: "COSC"}});
  const coursecode = screen.getByLabelText("Course Code:");
  await fireEvent.change(coursecode, {target: {value:"111"}});
  const desc = screen.getByLabelText("Course Description:");
  await fireEvent.change(desc, {target:{value:"TEST"}});
  const finish = screen.getByLabelText("Finish");
  // Click the finish button
  await user.click(finish);
  expect(global.alert).toHaveBeenCalledWith("Title cannot exceed 100 characters");
  await fireEvent.change(title, {target: {value:"123"}});
  let onethousandandonelongstring;
  for (let i = 0; i < 1001; i++) {
    onethousandandonelongstring += "a";
  }
  await fireEvent.change(desc, {target:{value:onethousandandonelongstring}});
  await user.click(finish);
  expect(global.alert).toHaveBeenCalledWith("Description cannot exceed 1000 characters");
  await fireEvent.change(desc, {target:{value:"EEEE"}});
  await fireEvent.change(coursecode, {target: {value:"abcd"}});
  await user.click(finish);
  expect(global.alert).toHaveBeenCalledWith("Course code should be 3 digits.");
});
