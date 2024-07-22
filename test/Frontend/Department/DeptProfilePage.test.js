import { act, render, screen,fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import DeptProfilePage from '../../../app/frontend/src/JS/Department/DeptProfilePage';
import { __esModule } from '@babel/preset-env';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');



  jest.mock('react-apexcharts', () => ({
	__esModule: true,
	default: () => <div />
}));

axios.get.mockImplementation((url) => {
    if (url == "http://localhost:3001/api/instructorProfile") {
        Promise.resolve({
            "data": {"name":"Mister Test", "ubcid": "12341234", "benchmark":50,
              "roles":[
                {"roleTitle": "Tester", "roleid":1},
                {"roleTitle": "Sandwich Artist", "roleid":2}
              ],
              "email":"mister.test@testing.com",
              "phoneNum":"250-123-1234",
              "office":"blah blah",
              "profileId":72,
              "teachingAssignments":[
                {"courseid":1, "assign":"COSC 111"},
                {"courseid":2, "assign":"STAT 222"},
              ]
            }
          });
    } else if (url == "http://localhost:3001/api/all-courses") {
        Promise.resolve({
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
                {"id": 9, "courseCode":"COSC 999", "title":"Cheese9", "description":"uhhhhhhhh", "status":true},
              ]
            }
          })
    } else {
        Promise.resolve({
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
                {"id": 9, "name":"janitor9", "department":"Computer Science", "description":"uhhhhhh", "status":true},
              ]
            }
          })
    }
 
}
);

beforeEach(async() => {
  const user = userEvent.setup();
  useAuth.mockReturnValue({
    profileId: { profileId: 'mocked-profileId'},
    accountType: { accountType: 'mocked-accountType' },
  });
  await act(async () => {
      ({getByTestId} = render(<MemoryRouter><DeptProfilePage/></MemoryRouter>)); 
  });
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
});

test('Checks profile data is rendered properly', async () => {
    let main = screen.getByTestId('main-container');
    expect(main).toBeInTheDocument();

    expect(main).toHaveTextContent("Mister Test's Profile");
});

