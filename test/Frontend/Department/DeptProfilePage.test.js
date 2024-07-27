import { act, render, screen,fireEvent, waitFor, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DeptProfilePage from '../../../app/frontend/src/JS/Department/DeptProfilePage';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import { __esModule } from '@babel/preset-env';
import WorkHoursBarChart from '../../../app/frontend/src/JS/Instructor/InsPerformanceImports/InsWorkHoursBarChart';


jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/Instructor/InsPerformanceImports/InsWorkHoursBarChart');
WorkHoursBarChart.mockImplementation(()=> {
  <div></div>
});

jest.mock('react-apexcharts', () => ({
	__esModule: true,
	default: () => <div />
}));


function mockData() {
  axios.get.mockImplementation((url) => {
    if (url == "http://localhost:3001/api/instructorProfile") {
        return Promise.resolve({
            data: {"name":"Mister Test", "ubcid": "12341234", "benchmark":"50",
              "roles":[
                {"roleTitle": "janitor", "roleid":1},
                {"roleTitle": "janitor2", "roleid":2}
              ],
              "email":"mister.test@testing.com",
              "phoneNum":"250-123-1234",
              "office":"blah blah",
              "profileId":72,
              "teachingAssignments":[
                {"courseid":1, "assign":"COSC 111"},
                {"courseid":2, "assign":"STAT 222"}
              ]
            }
          });
    } else if (url == "http://localhost:3001/api/all-courses") {
        return Promise.resolve({
            data: {"currentPage":1, "perPage": 10, "coursesCount":9,
              "courses":[
                {"id": 1, "courseCode":"COSC 111", "title":"Cheese", "description":"uhhhhhhhh", "status":true},
                {"id": 2, "courseCode":"STAT 222", "title":"Cheese2", "description":"uhhhhhhhh", "status":true},
                {"id": 3, "courseCode":"COSC 333", "title":"Cheese3", "description":"uhhhhhhhh", "status":true},
                {"id": 4, "courseCode":"MATH 444", "title":"Cheese4", "description":"uhhhhhhhh", "status":true},
                {"id": 5, "courseCode":"COSC 555", "title":"Cheese5", "description":"uhhhhhhhh", "status":true},
                {"id": 6, "courseCode":"COSC 666", "title":"Cheese6", "description":"uhhhhhhhh", "status":true},
                {"id": 7, "courseCode":"PHYS 777", "title":"Cheese7", "description":"uhhhhhhhh", "status":true},
                {"id": 8, "courseCode":"COSC 888", "title":"Cheese8", "description":"uhhhhhhhh", "status":true},
                {"id": 9, "courseCode":"COSC 999", "title":"Cheese9", "description":"uhhhhhhhh", "status":true}
              ]
            }
          })
    } else {
       return Promise.resolve({
            data: {"currentPage":1, "perPage": 10, "rolesCount":9,
              "roles":[
                {"id": 1, "name":"janitor", "department":"Computer Science", "description":"uhhhhhh", "status":true},
                {"id": 2, "name":"janitor2", "department":"Statistics", "description":"uhhhhhh", "status":true},
                {"id": 3, "name":"janitor3", "department":"Physics", "description":"uhhhhhh", "status":true},
                {"id": 4, "name":"janitor4", "department":"Math", "description":"uhhhhhh", "status":true},
                {"id": 5, "name":"janitor5", "department":"Computer Science", "description":"uhhhhhh", "status":true},
                {"id": 6, "name":"janitor6", "department":"Computer Science", "description":"uhhhhhh", "status":true},
                {"id": 7, "name":"janitor7", "department":"Computer Science", "description":"uhhhhhh", "status":true},
                {"id": 8, "name":"janitor8", "department":"Computer Science", "description":"uhhhhhh", "status":true},
                {"id": 9, "name":"janitor9", "department":"Computer Science", "description":"uhhhhhh", "status":true}
              ]
            }
          })
    }
 
}
);
return;
}

function mockEmptyData() {
  axios.get.mockImplementation(()=>{return Promise.resolve({
    data:{"name":"Mister Test", "ubcid": 12341234, "benchmark":null,
    "roles":[
      {}
    ],
    "email":null,
    "phoneNum":null,
    "office":null,
    "profileId":null,
    "teachingAssignments":[
      {}
    ]
  }})});
  return;
}

useAuth.mockReturnValue({
  authToken: { token: 'mocked-token'},
  accountType: { accountType: 'department' },
});

beforeEach(async() => {
  mockData();
  global.confirm = () => true;
  global.alert = jest.fn();
});

test('Checks profile data is rendered properly', async () => {
  await act(async () => {
    ({getByTestId} = render(<MemoryRouter><DeptProfilePage/></MemoryRouter>)); 
  });

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
  let main = screen.getByTestId('main-container');
  expect(main).toBeInTheDocument();

  expect(main).toHaveTextContent("Mister Test's Profile");
  expect(main).toHaveTextContent("12341234");
  expect(main).toHaveTextContent("Monthly Hours Benchmark: 50");
  expect(main).toHaveTextContent("mister.test@testing.com");
  expect(main).toHaveTextContent("250-123-1234");
  expect(main).toHaveTextContent("blah blah");
  expect(main).toHaveTextContent("- janitor");
  expect(main).toHaveTextContent("- janitor2");
  expect(main).toHaveTextContent("- COSC 111");
  expect(main).toHaveTextContent("- STAT 222");
});

test("Checks state of page when unrequired data is null", async() => {
  mockEmptyData();
  
  await act(async () => {
    ({getByTestId} = render(<MemoryRouter><DeptProfilePage/></MemoryRouter>)); 
  });
  let main = screen.getByTestId('main-container');

  expect(main).toHaveTextContent("Mister Test's Profile");
  expect(main).toHaveTextContent("12341234");
  expect(main).toHaveTextContent("Monthly Hours Benchmark: N/A");
  expect(main).toHaveTextContent("Phone Number: N/A");
  expect(main).toHaveTextContent("Office Location: N/A");
  expect(main).toHaveTextContent("Teaching Assignments: N/A");
  expect(main).toHaveTextContent("Service Role Assignments: N/A");
});

test("Checks profile info editing", async() => {
  const user = userEvent.setup();
  
  await act(async () => {
    ({getByTestId} = render(<MemoryRouter><DeptProfilePage/></MemoryRouter>)); 
  });

  let main = screen.getByTestId('main-container');
  let editButton = screen.getByTestId("edit-button");
  await user.click(editButton);

  // Change benchmark value
  let benchmarkInput = screen.getByTestId("benchmark");
  await fireEvent.change(benchmarkInput, {target: {value:25}});

  // Check cancelling works
  let cancelButton = screen.getByTestId("cancel-button");
  await user.click(cancelButton);
  expect(main).toHaveTextContent("Monthly Hours Benchmark: 50");

  // Check saving works
  editButton = screen.getByTestId("edit-button");
  await user.click(editButton);
  let saveButton = screen.getByTestId("save-button");
  benchmarkInput = screen.getByTestId("benchmark");
  await fireEvent.change(benchmarkInput, {target: {value:25}});
  await user.click(saveButton);
  expect(main).toHaveTextContent("Monthly Hours Benchmark: 25");
});

test("Check modals render data properly", async() => {
  const user = userEvent.setup();
  
  await act(async () => {
    ({getByTestId} = render(<MemoryRouter><DeptProfilePage/></MemoryRouter>)); 
  });

  let main = screen.getByTestId('main-container');
  let editButton = screen.getByTestId("edit-button");
  await user.click(editButton);

  let assignRoles = screen.getByTestId("assign-roles");
  await user.click(assignRoles);

  let modal = screen.getByTestId("assignModal");

  expect(modal).toHaveTextContent("janitor2");
  expect(modal).toHaveTextContent("janitor8");
  expect(modal).not.toHaveTextContent("janitor9");

  let next = screen.getByText(">");
  expect(next).toBeInTheDocument();
  await user.click(next);
  expect(modal).toHaveTextContent("janitor9");
  expect(modal).not.toHaveTextContent("janitor8");

  let closeButton = screen.getByTestId("close-button");
  await user.click(closeButton);

  let assignCourses = screen.getByTestId("assign-courses");
  await user.click(assignCourses);
  modal = screen.getByTestId("assignModal");
  expect(modal).toHaveTextContent("COSC 111:");
  expect(modal).toHaveTextContent("COSC 888:");
  expect(modal).not.toHaveTextContent("COSC 999:");

  next = screen.getByText(">");
  expect(next).toBeInTheDocument();
  await user.click(next);
  expect(modal).toHaveTextContent("COSC 999:");
  expect(modal).not.toHaveTextContent("COSC 111:");
});

test("Checks assigning roles", async() => {
  const user = userEvent.setup();
  
  await act(async () => {
    ({getByTestId} = render(<MemoryRouter><DeptProfilePage/></MemoryRouter>)); 
  });

  let main = screen.getByTestId('main-container');
  let editButton = screen.getByTestId("edit-button");
  await user.click(editButton);

  let assignRoles = screen.getByTestId("assign-roles");
  await user.click(assignRoles);

  let modal = screen.getByTestId("assignModal");

  let addButton = screen.getByText("janitor3").parentElement.querySelector("button");

  // Expect add button to change to remove when clicked
  expect(addButton).toHaveTextContent("Add");
  await user.click(addButton);
  expect(addButton).toHaveTextContent("Remove");

  // Checks close button functionality
  let closeButton = screen.getByTestId("close-button");
  await user.click(closeButton);
  expect(modal).not.toBeInTheDocument();

  // Checks that closing it from the X button doesn't save anything
  expect(main).not.toHaveTextContent("- janitor3");

  await user.click(screen.getByTestId("assign-roles"));
  
  addButton = screen.getByText("janitor3").parentElement.querySelector("button");
  expect(addButton).toBeInTheDocument();
  expect(addButton).toHaveTextContent("Add");
  await user.click(addButton);
  expect(addButton).toHaveTextContent("Remove");

  // Checks clicking the save button adds it to the list of currently assigned roles
  let modalsaveButton = screen.getByTestId("modalsave-button");
  await user.click(modalsaveButton);

  expect(modal).not.toBeInTheDocument();
  expect(main).toHaveTextContent("- janitor3");

  // Checks that changes are reflected when clicking save
  let saveButton = screen.getByTestId("save-button");
  await user.click(saveButton);
  expect(main).toHaveTextContent("- janitor3");

  // Checks that changes are reset when clicking cancel
  editButton = screen.getByTestId("edit-button");
  await user.click(editButton);
  assignRoles = screen.getByTestId("assign-roles");
  await user.click(assignRoles);
  addButton = screen.getByText("janitor4").parentElement.querySelector("button");
  await user.click(addButton);
  modalsaveButton = screen.getByTestId("modalsave-button");
  await user.click(modalsaveButton);
  let cancelButton = screen.getByTestId("cancel-button");
  await user.click(cancelButton);
  expect(main).not.toHaveTextContent("- janitor4");


  // Checks that the remove button next to the role works
  editButton = screen.getByTestId("edit-button");
  await user.click(editButton);
  let selectedRole = screen.getByText("- janitor2");
  expect(selectedRole).toBeInTheDocument();
  let removeButton = selectedRole.parentElement.querySelector("button");
  await user.click(removeButton);
  expect(main).not.toHaveTextContent("- janitor2");

  // Checks that the remove button reflects inside the modal as well
  await user.click(screen.getByTestId("assign-roles"));
  addButton = screen.getByText("janitor2").parentElement.querySelector("button");
  expect(addButton).toHaveTextContent("Add");
  
});

test("Checks assigning courses modal", async() => {
  const user = userEvent.setup();
  
  await act(async () => {
    ({getByTestId} = render(<MemoryRouter><DeptProfilePage/></MemoryRouter>)); 
  });

  let main = screen.getByTestId('main-container');
  let editButton = screen.getByTestId("edit-button");
  await user.click(editButton);

  let assignCourses = screen.getByTestId("assign-courses");
  await user.click(assignCourses);

  let modal = screen.getByTestId("assignModal");
  
  let addButton = screen.getByText("COSC 333:").parentElement.querySelector("button");

  // Expect add button to change to remove when clicked
  expect(addButton).toHaveTextContent("Add");
  await user.click(addButton);
  expect(addButton).toHaveTextContent("Remove");

  // Checks close button functionality
  let closeButton = screen.getByTestId("close-button");
  await user.click(closeButton);
  expect(modal).not.toBeInTheDocument();

  // Checks that closing it from the X button doesn't save anything
  expect(main).not.toHaveTextContent("- COSC 333");

  await user.click(screen.getByTestId("assign-courses"));
  
  addButton = screen.getByText("COSC 333:").parentElement.querySelector("button");
  expect(addButton).toBeInTheDocument();
  expect(addButton).toHaveTextContent("Add");
  await user.click(addButton);
  expect(addButton).toHaveTextContent("Remove");

  // Checks clicking the save button adds it to the list of currently assigned courses
  let modalsaveButton = screen.getByTestId("modalsave-button");
  await user.click(modalsaveButton);

  expect(modal).not.toBeInTheDocument();
  expect(main).toHaveTextContent("- COSC 333");

  // Checks that changes are reflected when clicking save
  let saveButton = screen.getByTestId("save-button");
  await user.click(saveButton);
  expect(main).toHaveTextContent("- COSC 333");

  // Checks that changes are reset when clicking cancel
  editButton = screen.getByTestId("edit-button");
  await user.click(editButton);
  assignCourses = screen.getByTestId("assign-courses");
  await user.click(assignCourses);
  addButton = screen.getByText("MATH 444:").parentElement.querySelector("button");
  await user.click(addButton);
  modalsaveButton = screen.getByTestId("modalsave-button");
  await user.click(modalsaveButton);
  let cancelButton = screen.getByTestId("cancel-button");
  await user.click(cancelButton);
  expect(main).not.toHaveTextContent("- MATH 444");


  // Checks that the remove button next to the course works
  editButton = screen.getByTestId("edit-button");
  await user.click(editButton);
  let selectedCourse = screen.getByText("- STAT 222");
  expect(selectedCourse).toBeInTheDocument();
  let removeButton = selectedCourse.parentElement.querySelector("button");
  await user.click(removeButton);
  expect(main).not.toHaveTextContent("- STAT 222");

  // Checks that the remove button reflects inside the modal as well
  await user.click(screen.getByTestId("assign-courses"));
  addButton = screen.getByText("STAT 222:").parentElement.querySelector("button");
  expect(addButton).toHaveTextContent("Add");
  
});

