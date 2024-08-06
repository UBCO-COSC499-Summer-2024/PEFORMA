import {act, getByTestId, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InsCourseHistory from '../../../app/frontend/src/JS/Instructor/InsCourseHistory';
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
                                    return Promise.resolve({"data": {currentTerm:20234}}); }
                  return;
  });
}

beforeEach(async() => {
  mockData();
  console.log = jest.fn();
});

test('Checks if data is properly rendered', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
        render(<MemoryRouter><InsCourseHistory/></MemoryRouter>);
    });
    const main = screen.getByTestId("courseinfo-main");
    expect(main).toHaveTextContent("Cheese");
    expect(main).toHaveTextContent("Fish");
    expect(main).toHaveTextContent("COSC 123");
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
});
