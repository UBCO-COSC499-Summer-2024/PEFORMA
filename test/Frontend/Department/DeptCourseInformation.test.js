import {act, getByTestId, render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DeptCourseInformation from '../../../app/frontend/src/JS/Department/DeptCourseInformation';
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
    if (url == 'http://localhost:3001/api/courseHistory') {
      return Promise.resolve({"data":{perPage: 5, currentPage: 1, courseID:1, entryCount:7, exists:true, courseCode:"COSC 123", courseName:"Cheese", courseDescription: "Fish",
                                      division:"Computer Science", avgScore:50, latestTerm:20234,
                                      history:[
                                        {instructorID: 1, instructorName:"Mister Test1", term:4, session:"2023S", score:55, term_num:20234, ubcid:"12341234", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                        {instructorID: 2, instructorName:"Mister Test2", term:4, session:"2022S", score:56, term_num:20224, ubcid:"12341235", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                        {instructorID: 3, instructorName:"Mister Test3", term:4, session:"2022S", score:57, term_num:20224, ubcid:"12341236", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                        {instructorID: 4, instructorName:"Mister Test4", term:4, session:"2022S", score:58, term_num:20224, ubcid:"12341237", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                        {instructorID: 5, instructorName:"Mister Test5", term:4, session:"2022S", score:59, term_num:20224, ubcid:"12341238", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                        {instructorID: 6, instructorName:"Mister Test6", term:4, session:"2022S", score:60, term_num:20224, ubcid:"12341239", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                        {instructorID: 7, instructorName:"Mister Test7", term:4, session:"2022S", score:60, term_num:20224, ubcid:"12341230", location:"Antarctica", enrollment:150, meetingPattern:"Never!"}
                                      ],
                                    tainfo:[
                                        {taname:"Mister Test Jr.1", taemail:"mistertestjr1@ubc.ca",taUBCId:"43214321", taterm:20234},
                                        {taname:"Mister Test Jr.2", taemail:"mistertestjr2@ubc.ca",taUBCId:"43214322", taterm:20234}
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
    if (url == 'http://localhost:3001/api/courseHistory') {
        return Promise.resolve({"data":{perPage: 5, currentPage: 1, courseID:1, entryCount:7, exists:true, courseCode:123, courseName:"Cheese", courseDescription: "Fish",
                                        division:"Computer Science", avgScore:50, latestTerm:20234,
                                        history:[
                                          {instructorID: 1, instructorName:"Mister Test1", term:4, session:"2023S", score:55, term_num:20234, ubcid:"12341234", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                          {instructorID: 2, instructorName:"Mister Test2", term:4, session:"2022S", score:56, term_num:20224, ubcid:"12341235", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                          {instructorID: 3, instructorName:"Mister Test3", term:4, session:"2022S", score:57, term_num:20224, ubcid:"12341236", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                          {instructorID: 4, instructorName:"Mister Test4", term:4, session:"2022S", score:58, term_num:20224, ubcid:"12341237", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                          {instructorID: 5, instructorName:"Mister Test5", term:4, session:"2022S", score:59, term_num:20224, ubcid:"12341238", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                          {instructorID: 6, instructorName:"Mister Test6", term:4, session:"2022S", score:60, term_num:20224, ubcid:"12341239", location:"Antarctica", enrollment:150, meetingPattern:"Never!"},
                                          {instructorID: 7, instructorName:"Mister Test7", term:4, session:"2022S", score:60, term_num:20224, ubcid:"12341230", location:"Antarctica", enrollment:150, meetingPattern:"Never!"}
                                        ],
                                      tainfo:[
                                          {taname:"Mister Test Jr.1", taemail:"mistertestjr1@ubc.ca",taUBCId:"43214321", taterm:20234},
                                          {taname:"Mister Test Jr.2", taemail:"mistertestjr2@ubc.ca",taUBCId:"43214322", taterm:20234}
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
  console.log = jest.fn();
  global.confirm = () => true;
  global.alert = jest.fn();
});

test('Checks if data is properly rendered', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
        render(<MemoryRouter><DeptCourseInformation/></MemoryRouter>);
    });
    const main = screen.getByTestId("courseinfo-main");
    expect(main).toHaveTextContent("Cheese");
    expect(main).toHaveTextContent("Fish");
    expect(main).toHaveTextContent("COSC 123");
    expect(main).toHaveTextContent("Average Performance Score: 50");
    expect(main).toHaveTextContent("Mister Test1");
    expect(main).toHaveTextContent("Antarctica");
    expect(main).toHaveTextContent("Never!");
    expect(main).toHaveTextContent("Number of Students: 150");
    expect(main).toHaveTextContent("Mister Test Jr.1");
    expect(main).toHaveTextContent("mistertestjr1@ubc.ca");
    // Check that content on page 2 is not visible
    expect(main).not.toHaveTextContent("Mister Test7");
    // Click next page and then check if it's there
    let next = screen.getByText(">");
    expect(next).toBeInTheDocument();
    await user.click(next);
    expect(main).toHaveTextContent("Mister Test7");
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
      render(<MemoryRouter><DeptCourseInformation/></MemoryRouter>);
  });
  const main = screen.getByTestId("courseinfo-main");
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
  expect(console.log).not.toBeCalledWith("Refetching data...");
  assignButton = screen.getByTestId("assign-button");
  await user.click(assignButton);
  // Check saving works
  modal = screen.getByTestId("assignModal");
  addButton = screen.getByText("Mister Test11").parentElement.querySelector("button");
  await user.click(addButton);
  let modalsaveButton = screen.getByTestId("modalsave-button");
  await user.click(modalsaveButton);
  expect(modal).not.toBeInTheDocument();
  expect(console.log).toBeCalledWith("Refetching data...");
});

test('Checks editing info works', async() => {
  const user = userEvent.setup();
  await act(async () => {
      render(<MemoryRouter><DeptCourseInformation/></MemoryRouter>);
  });
  const main = screen.getByTestId("courseinfo-main");
  let editButton = screen.getByTestId("edit");
  expect(main).not.toHaveTextContent("Save");
  await user.click(editButton);
  expect(main).toHaveTextContent("Save");
  
  let descEdit = screen.getByTestId("courseDescription");
  await fireEvent.change(descEdit, {target: {value:"EEE"}});
  let saveButton = screen.getByTestId("save");
  await user.click(saveButton);
  expect(main).toHaveTextContent("EEE");
});

test('Check past state', async() => {
  mockPast();
  await act(async () => {
    render(<MemoryRouter><DeptCourseInformation/></MemoryRouter>);
  });

  const main = screen.getByTestId("courseinfo-main");
  expect(main).toHaveTextContent("2022");
  expect(main).not.toHaveTextContent("Assign Instructor(s)");
});
