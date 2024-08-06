import {act, getByTestId, render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
                                      department:"Computer Science", benchmark:0, latestYear:20234, exists:true,
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
    } else if (url == "http://localhost:3001/api/instructors") {
      return Promise.resolve({"data":{perPage: 8, currentPage: 1, instructorCount:9,
        instructors:[
          {profileId: 1, name:"Mister Test11", id:"11112221"},
          {profileId: 2, name:"Mister Test12", id:"11112222"},
          {profileId: 3, name:"Mister Test13", id:"11112223"},
          {profileId: 4, name:"Mister Test14", id:"11112224"},
          {profileId: 5, name:"Mister Test15", id:"11112225"},
          {profileId: 6, name:"Mister Test16", id:"11112226"},
          {profileId: 7, name:"Mister Test17", id:"11112227"},
          {profileId: 8, name:"Mister Test18", id:"11112228"},
          {profileId: 9, name:"Mister Test19", id:"11112229"},
        ]}});
    }
  });
  return;
}

function mockPast() {
  axios.get.mockImplementation((url) => {
    if (url == 'http://localhost:3001/api/roleInfo') {
      return Promise.resolve({"data":{perPage: 5, currentPage: 1, roleID:1, assigneeCount:7, roleName:"Cheese", roleDescription: "Fish",
                                      department:"Computer Science", benchmark:0, latestYear:20234, exists:true,
                                      assignees:[
                                        {instructorID: '12341234', name:"Mister Test1", year:2023},
                                        {instructorID: '12341235', name:"Mister Test2", year:2023},
                                        {instructorID: '12341236', name:"Mister Test3", year:2023},
                                        {instructorID: '12341237', name:"Mister Test4", year:2023},
                                        {instructorID: '12341238', name:"Mister Test5", year:2023},
                                        {instructorID: '12341239', name:"Mister Test6", year:2023}
                                      ]}});
    } else if (url == "http://localhost:3001/api/terms") {
      return Promise.resolve({"data": {currentTerm:20224}});
    } else if (url == "http://localhost:3001/api/instructors") {
      return Promise.resolve({"data":{perPage: 8, currentPage: 1, instructorCount:9,
        instructors:[
          {profileId: 1, name:"Mister Test11", id:"11112221"},
          {profileId: 2, name:"Mister Test12", id:"11112222"},
          {profileId: 3, name:"Mister Test13", id:"11112223"},
          {profileId: 4, name:"Mister Test14", id:"11112224"},
          {profileId: 5, name:"Mister Test15", id:"11112225"},
          {profileId: 6, name:"Mister Test16", id:"11112226"},
          {profileId: 7, name:"Mister Test17", id:"11112227"},
          {profileId: 8, name:"Mister Test18", id:"11112228"},
          {profileId: 9, name:"Mister Test19", id:"11112229"},
        ]}});
    }
  });
  return;
}

beforeEach(async() => {
  mockData();
  delete window.location;
  window.location = { reload: jest.fn() };
  global.confirm = () => true;
  global.alert = jest.fn();
});

test('Checks if data is properly rendered', async () => {
    const user = userEvent.setup();
    await act(async () => {
        render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>);
    });
    const main = screen.getByTestId("ri-main");
    expect(main).toHaveTextContent("Cheese");
    expect(main).toHaveTextContent("Fish");
    expect(main).toHaveTextContent("Computer Science");
    expect(main).toHaveTextContent("Mister Test1");
    // Check that content on page 2 is not visible
    expect(main).not.toHaveTextContent("Mister Test6");
    // Click next page and then check if it's there
    let next = screen.getByText(">");
    expect(next).toBeInTheDocument();
    await user.click(next);
    expect(main).toHaveTextContent("Mister Test6");
    // Check assign modal data is rendered properly
    const assignButton = screen.getByTestId("assign-button");
    await user.click(assignButton);
    let modal = screen.getByTestId("assignModal");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent("Mister Test11");
    expect(modal).not.toHaveTextContent("Mister Test19");
    next = screen.getAllByText(">");
    await user.click(next[0]);
    expect(modal).toHaveTextContent("Mister Test19");
});

test('Checks assigning people works', async() => {
  const user = userEvent.setup();
  await act(async () => {
      render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>);
  });
  const main = screen.getByTestId("ri-main");
  expect(main).not.toHaveTextContent("Mister Test11");

  let assignButton = screen.getByTestId("assign-button");
  await user.click(assignButton);
  let addButton = screen.getByText("Mister Test11").parentElement.querySelector("button");
  await user.click(addButton);
  let modal = screen.getByTestId("assignModal");
  // Checks closing modal works
  let closeButton = screen.getByTestId("close-button");
  await user.click(closeButton);
  expect(modal).not.toBeInTheDocument();
  expect(window.location.reload).toHaveBeenCalledTimes(0);
  assignButton = screen.getByTestId("assign-button");
  await user.click(assignButton);
  // Check saving works
  modal = screen.getByTestId("assignModal");
  addButton = screen.getByText("Mister Test11").parentElement.querySelector("button");
  await user.click(addButton);
  let modalsaveButton = screen.getByTestId("modalsave-button");
  await user.click(modalsaveButton);
  expect(modal).not.toBeInTheDocument();
  expect(window.location.reload).toHaveBeenCalledTimes(1);
});

test('Checks editing info works', async() => {
  const user = userEvent.setup();
  await act(async () => {
      render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>);
  });
  const main = screen.getByTestId("ri-main");
  let editButton = screen.getByTestId("edit");
  expect(main).not.toHaveTextContent("Save");
  await user.click(editButton);
  expect(main).toHaveTextContent("Save");
  
  let titleEdit = screen.getByTestId("roleName");
  await fireEvent.change(titleEdit, {target: {value:"EEE"}});
  let saveButton = screen.getByTestId("save");
  await user.click(saveButton);
  expect(main).toHaveTextContent("EEE");
});

test('Check past state', async() => {
  const user = userEvent.setup();
  mockPast();
  await act(async () => {
    render(<MemoryRouter><DeptRoleInformation/></MemoryRouter>);
  });
    console.log = jest.fn();
  const logspy = jest.spyOn(global.console, 'log');

  console.log(logspy);
  const main = screen.getByTestId("ri-main");
  expect(main).toHaveTextContent("2022");
  expect(main).not.toHaveTextContent("Assign Instructor(s)");
});