import {render, screen, waitFor, element } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseList from '../../../app/frontend/src/JS/Instructor/CourseList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/AuthContext');

describe('CourseList', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
	});
	test('Testing course list to be rendered with mock data', async () => {
		
		axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {"division":"MATH", "divisionLabel":"Mathmatics", "currentPage":1, "perPage": 10, "divisionCoursesCount":1,
          "courses":[
            { "id": "MATH 100", "title": "Differential Calculus with Applications to Physical Sciences and Engineering", "instructor": ["Brandi Floyd"], "ubcid":[32819340], "email": ["brandi@instructor.ubc.ca"] }
          ]
        },
			})
		);

		render(
			<MemoryRouter>
				<CourseList />
			</MemoryRouter>
		);

		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const element = document.getElementById('course-test-content');
    
    expect(element).toHaveTextContent("Course");
    expect(element).toHaveTextContent("Title");
    expect(element).toHaveTextContent("Instructor");
    expect(element).toHaveTextContent("Email");

    expect(element).toHaveTextContent("MATH 100");
    expect(element).toHaveTextContent("Differential Calculus with Applications to Physical Sciences and Engineering");
    expect(element).toHaveTextContent("Brandi Floyd");
    expect(element).toHaveTextContent("brandi@instructor.ubc.ca");
	});
});