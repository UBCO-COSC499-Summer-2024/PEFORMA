import {render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsCourseList from '../../../app/frontend/src/JS/Instructor/InsCourseList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mocking axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('InsCourseList', () => {
  let element;

	beforeEach(() => {
		useAuth.mockReturnValue({ // mocking authToken
			authToken: { token: 'mocked-token' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({ // mocking data
				data: {"division":"MATH", "divisionLabel":"Mathmatics", "currentPage":1, "perPage": 10, "divisionCoursesCount":1,
          "courses":[
            { 
              "id": "MATH 100", 
              "title": "Differential Calculus with Applications to Physical Sciences and Engineering", 
              "instructor": ["Brandi Floyd"], 
              "ubcid":[32819340], 
              "email": ["brandi@instructor.ubc.ca"],
              "profileid": [123456]
            },
            { 
              "id": "MATH 111", 
              "title": "Testing", 
              "instructor": ["Brandi Floyd", "Leo Ma"], 
              "ubcid":[32819340, 12341234], 
              "email": ["brandi@instructor.ubc.ca", "testing@ubc.ca"],
              "profileid": [123456, 789012]
            }
          ]
        },
			})
		);
    render( // render InsCourseList
			<MemoryRouter>
				<InsCourseList />
			</MemoryRouter>      
		);
    element = document.getElementById('course-test-content'); // set element by id
	});

	test('Testing course list to be rendered with mock data', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    // expect mock data renders properly
    expect(element).toHaveTextContent("Course");
    expect(element).toHaveTextContent("Title");
    expect(element).toHaveTextContent("Instructor");
    expect(element).toHaveTextContent("Email");

    expect(element).toHaveTextContent("MATH 100");
    expect(element).toHaveTextContent("Differential Calculus with Applications to Physical Sciences and Engineering");
    expect(element).toHaveTextContent("Brandi Floyd");
    expect(element).toHaveTextContent("brandi@instructor.ubc.ca");
	});

  test('Check if drop down menu exists', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    const element = document.getElementById('dropdown-test-content'); // find dropdown feature for switching to different division
    expect(element).toHaveTextContent('List of Courses');
    
    // see if all division shows up
    expect(element).toHaveTextContent('Computer Science');
    expect(element).toHaveTextContent('Mathmatics');
    expect(element).toHaveTextContent('Physics');
    expect(element).toHaveTextContent('Statistics');
    expect(element).toHaveTextContent('All');

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  })
  test('Testing on course where it containts two or more instructors', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    // if there are two instructor teaching same course, see if two instructor renders well
    expect(element).toHaveTextContent('Brandi Floyd');
    expect(element).toHaveTextContent('Leo Ma');
    expect(element).toBeInTheDocument('brandi@instructor.ubc.ca')
    expect(element).toBeInTheDocument('testing@ubc.ca')
  })
});