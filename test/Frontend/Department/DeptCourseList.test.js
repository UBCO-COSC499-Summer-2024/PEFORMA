import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptCourseList from '../../../app/frontend/src/JS/Department/DeptCourseList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/AuthContext');

describe('DeptCourseList', () => {
  let element; 

	beforeEach(() => {
		useAuth.mockReturnValue({
			authToken: { token: 'mocked-token' },
		});
    axios.get.mockImplementation(() => 
			Promise.resolve({
				data: {"currentPage":1, "perPage": 10, "coursesCount":12,
          courses:[
            { "id": 1, "courseCode": "COSC 101", "title": "Digital Citizenship", "description":"description testing"},
            { "id": 2, "courseCode": "COSC 111", "title": "Computer Programming I", "description":"description testing"},
            { "id": 3, "courseCode": "COSC 123", "title": "Computer Creativity", "description":"description testing"},
            { "id": 4, "courseCode": "COSC 304", "title": "Introduction to Database", "description":"Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies." },
            { "id": 5, "courseCode": "COSC 211", "title": "Machine Architecture", "description":"description testing" },
            { "id": 6, "courseCode": "COSC 221", "title": "Introduction to Discrete Structures", "description":"description testing"},
            { "id": 7, "courseCode": "STAT 121", "title": "Elementary Statistics", "description":"description testing"},
            { "id": 8, "courseCode": "PHYS 205", "title": "Introduction to Mathematical Statistics","description":"description testing"},
            { "id": 9, "courseCode": "PHYS 400", "title": "Statistical Communication and Consulting", "description":"description testing"},
            { "id": 10, "courseCode": "COSC 341", "title": "Human computer Interaction","description":"description testing"},
            { "id": 11, "courseCode": "MATH 100", "title": "Differential Calculus with Applications to Physical Sciences and Engineering","description":"MATH IS MATH"},
            { "id": 12, "courseCode": "TEST 17", "title": "Testing 123","description":"description testing"},
          ]
        }
			})
		);
    render(
			<MemoryRouter>
				<DeptCourseList />
			</MemoryRouter>
		);
    element = document.getElementById('dept-course-list-test-content');
	});

  test('Testing rendering with mock data course list', async () => {
		await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(element).toHaveTextContent("List of Course Lists (12 Active");
    
    expect(element).toHaveTextContent("COSC 111");
    expect(element).toHaveTextContent("STAT 121");
    expect(element).toHaveTextContent("PHYS 205");
    expect(element).toHaveTextContent("COSC 123");
    expect(element).toHaveTextContent("COSC 341");

    expect(element).not.toHaveTextContent("COSC 50000"); // no data in mock data 
    expect(element).not.toHaveTextContent("TEST 17"); // should be in second page
    expect(element).not.toHaveTextContent("MATH 100"); // should be in second page

    expect(element).toHaveTextContent("Digital Citizenship");
    expect(element).toHaveTextContent("Computer Creativity");
    expect(element).toHaveTextContent("Elementary Statistics");
    
    // randome words that is not in mock data, expecting not to show up
    expect(element).not.toHaveTextContent("Some random test that should not be in")

    expect(element).toHaveTextContent("Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.");
    expect(element).toHaveTextContent("description testing");

  })
  test('Check if pagination exists', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const paginationElement = element.querySelector('.pagination'); 
    expect(paginationElement).toBeInTheDocument();
  });
  test('Test next button in pagination', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    const nextPageButton = element.querySelector('.pagination .next a') || element.querySelector('.pagination li:last-child a');
    fireEvent.click(nextPageButton);

    await waitFor(() => { // now show only page 2 contents
      expect(element).toHaveTextContent("MATH 100");
      expect(element).toHaveTextContent("TEST 17");

      // cosc 111 is in first page, so not.toHaveTextContext
      expect(element).not.toHaveTextContent("COSC 111"); 

      expect(element).toHaveTextContent("MATH IS MATH");
      expect(element).toHaveTextContent("Differential Calculus with Applications to Physical Sciences and Engineering");
      expect(element).toHaveTextContent("Testing 123");
      expect(element).toHaveTextContent("description testing");
    });
  });
  test('Test prev button in pagination', async() => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));

    const prevPageButton = element.querySelector('.pagination .prev a') || element.querySelector('.pagination li:first-child a');;
    fireEvent.click(prevPageButton);

    await waitFor(() => { // now show page 1 again
      expect(element).toHaveTextContent("COSC 304");
      expect(element).toHaveTextContent("PHYS 205");

      // MATH 100 is in page 2, so not.toHaveTextContext
      expect(element).not.toHaveTextContent("MATH 100"); 

      expect(element).toHaveTextContent("Introduction to Database");
      expect(element).toHaveTextContent("Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.");
      expect(element).toHaveTextContent("Introduction to Mathematical Statistics");
      expect(element).toHaveTextContent("description testing");
    });
  })
});