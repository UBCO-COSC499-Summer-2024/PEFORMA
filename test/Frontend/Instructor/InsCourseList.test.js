import {render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsCourseList from '../../../app/frontend/src/JS/Instructor/InsCourseList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('InsCourseList', () => {
  let element;

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
      accountType: { accountType: 'mocked-accountType' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {"division":"MATH", "divisionLabel":"Mathmatics", "currentPage":1, "perPage": 10, "divisionCoursesCount":1,
          "courses":[
            { "id": 1, "coursecode": "MATH 100", "title": "Differential Calculus with Applications to Physical Sciences and Engineering", "instructor": ["Brandi Floyd"], "ubcid":[32819340], "email": ["brandi@instructor.ubc.ca"] },
            { "id": 2, "coursecode":"MATH 111", "title": "Testing", "instructor": ["Brandi Floyd", "Leo Ma"], "ubcid":[32819340, 12341234], "email": ["brandi@instructor.ubc.ca", "testing@ubc.ca"] }
          ]
        },
			})
		);
    render(
			<MemoryRouter>
				<InsCourseList />
			</MemoryRouter>      
		);
    element = document.getElementById('course-test-content');
	});

	test('Testing course list to be rendered with mock data', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
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
    const element = document.getElementById('dropdown-test-content');
    expect(element).toHaveTextContent('List of Courses');
    
    expect(element).toHaveTextContent('Computer Science');
    expect(element).toHaveTextContent('Mathmatics');
    expect(element).toHaveTextContent('Physics');
    expect(element).toHaveTextContent('Statistics');
    expect(element).toHaveTextContent('All');

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  })
  test('Testing on course where it containts two or more instructors', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    expect(element).toHaveTextContent('Brandi Floyd');
    expect(element).toHaveTextContent('Leo Ma');
    expect(element).toBeInTheDocument('brandi@instructor.ubc.ca')
    expect(element).toBeInTheDocument('testing@ubc.ca')
  })
});