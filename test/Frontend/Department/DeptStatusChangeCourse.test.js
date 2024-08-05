import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptStatusChangeCourse from '../../../app/frontend/src/JS/Department/DeptStatusChangeCourse';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('DeptStatusChangeCourse', () => {
  let element; 

  beforeEach(() => {
    useAuth.mockReturnValue({
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId' }
    });

    // Mock useLocation to return state with memberData
    useLocation.mockReturnValue({
      state: {
        deptCourseList: {"currentPage":1, "perPage": 10, "coursesCount":12,
          courses:[
            { "id": 1, "courseCode": "COSC 101", "title": "Digital Citizenship", "description":"some description about the course called digital citizenship", "status":false},
            { "id": 2, "courseCode": "COSC 111", "title": "Computer Programming I", "description":"description testing", "status":true},
            { "id": 3, "courseCode": "COSC 123", "title": "Computer Creativity", "description":"description testing", "status":false},
            { "id": 4, "courseCode": "COSC 304", "title": "Introduction to Database", "description":"Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.", "status":false},
            { "id": 5, "courseCode": "COSC 211", "title": "Machine Architecture", "description":"description testing", "status":true},
            { "id": 6, "courseCode": "COSC 221", "title": "Introduction to Discrete Structures", "description":"description testing", "status":true},
            { "id": 7, "courseCode": "TEST 17", "title": "Elementary Statistics", "description":"description for stat course", "status":true},
            { "id": 8, "courseCode": "PHYS 205", "title": "Introduction to Mathematical Statistics","description":"description testing", "status":true},
            { "id": 9, "courseCode": "PHYS 400", "title": "Statistical Communication and Consulting", "description":"description testing", "status":false},
            { "id": 10, "courseCode": "COSC 341", "title": "Human computer Interaction","description":"description testing", "status":true},
            { "id": 11, "courseCode": "MATH 100", "title": "Differential Calculus with Applications to Physical Sciences and Engineering","description":"MATH IS MATH", "status":true},
            { "id": 12, "courseCode": "TEST", "title": "Testing 123","description":"testing second page data", "status":true},
          ]
        }
      }
    });
    axios.post.mockResolvedValue({ status: 200 });
    render(
      <MemoryRouter>
        <DeptStatusChangeCourse />
      </MemoryRouter>
    );
    element = document.getElementById('course-status-controller-test-content');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Testing rendering with mock data course data', async () => { 
    // Expect to be 1 time only called because it's using location.state to receive data, 1 time for topbar
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    await waitFor(() => {
      expect(element).toHaveTextContent("List of Courses (12 in Database)");
      // Expect only first page courses to be in screen
      expect(element).toHaveTextContent("COSC 101");
      expect(element).toHaveTextContent("COSC 304");
      expect(element).toHaveTextContent("Elementary Statistics");      
      expect(element).toHaveTextContent("Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.");
      // Expect not "TEST 17" to have in first page because it's a data aligns with second page
      expect(element).not.toHaveTextContent("MATH 100");
      expect(element).not.toHaveTextContent("Differential Calculus with Applications to Physical Sciences and Engineering");
    });
  });
  test('Check Active/Inactive button exists', async () => {
    await waitFor(() => {
        // Check if the element exists
        expect(element).toBeInTheDocument();

        // Check if "Active" button exists
        const activeButton = element.querySelector('button.active-button');
        const inactiveButton = element.querySelector('button.inactive-button');
        expect(activeButton).toBeInTheDocument();
        expect(inactiveButton).toBeInTheDocument();
    });
  });
  test('Testing status controller making course True', async () => {
    await waitFor(() => {
      const rows = element.querySelectorAll('tbody tr');
      // expect length to be 10 rows
      expect(rows.length).toBe(10);

      // Find the row with the course "COSC 101"
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('COSC 101')) {
              memberRow = row;
          }
      });
      // expect row COSC 101 contains right information
      expect(memberRow.textContent).toContain('COSC 101');
      expect(memberRow.textContent).toContain('Digital Citizenship');
      expect(memberRow.textContent).toContain('some description about the course called digital citizenship');
      // expect row COSC 101 does not contains wrong information
      expect(memberRow.textContent).not.toContain('MATH 100');

      // toggleButton is "Active" button
      const toggleButton = memberRow.querySelector('button:nth-child(1)');
      expect(toggleButton.textContent).toContain('Active'); // expect its active button

      // COSC 101 in mock data has False, inactive button should have disabled property (non clickable)
      const inactiveButton = memberRow.querySelector('button.inactive-button');
      expect(inactiveButton).toBeDisabled();

      // Click the active button
      fireEvent.click(toggleButton);

    });
    await waitFor(() => {
      // Request COSC 101 (courseId 1) status changing to true
      expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/api/DeptStatusChangeCourse',
          { courseid: 1, newStatus: true },
          { headers: { Authorization: 'Bearer mocked-token' } }
      );
    });
    await waitFor(() => {
      // Check if the status has been updated
      const rows = element.querySelectorAll('tbody tr');
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('COSC 101')) {
              memberRow = row;
          }
      });
      // Check if status changed to Active (checking active button has disabled property)
      const activeButton = memberRow.querySelector('button.active-button');
      expect(activeButton).toBeDisabled();
    });
  });
  test('Testing status controller making course False', async () => {
    await waitFor(() => {
      const rows = element.querySelectorAll('tbody tr');
      // expect length to be 10 rows
      expect(rows.length).toBe(10);

      // Find the row with the course "TEST 17"
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('TEST 17')) {
              memberRow = row;
          }
      });
      // expect row TEST 17 contains right information
      expect(memberRow.textContent).toContain('TEST 17');
      expect(memberRow.textContent).toContain('Elementary Statistics');
      expect(memberRow.textContent).toContain('description for stat course');
      // expect row TEST 17 does not contains wrong information
      expect(memberRow.textContent).not.toContain('STAT 123');

      // toggleButton is "Inactive" button
      const toggleButton = memberRow.querySelector('button:nth-child(2)');
      expect(toggleButton.textContent).toContain('Inactive'); // expect its inactive button


      // TEST 17 has true, so active button should have disabled (it means button is not clickable)
      const activeButton = memberRow.querySelector('button.active-button');
      expect(activeButton).toBeDisabled();

      // Click the inactive button
      fireEvent.click(toggleButton);

    });

    await waitFor(() => {
      // Request TEST 17 status changing to false
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/DeptStatusChangeCourse',
          { courseid: 7, newStatus: false },
          { headers: { Authorization: 'Bearer mocked-token' } }
      );
    });

    await waitFor(() => {
      // Check again after request
      const rows = element.querySelectorAll('tbody tr');
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('TEST 17')) {
              memberRow = row;
          }
      });
      // deactive is requested, so inative button is not having disabled property making button unclickable
      const inactiveButton = memberRow.querySelector('button.inactive-button');
      expect(inactiveButton).toBeDisabled();
    });
  });
  test('Testing making course inactive in second page', async () => {
    const nextPageButton = element.querySelector('.pagination .next a') || element.querySelector('.pagination li:last-child a');
    fireEvent.click(nextPageButton);
    
    // check if second page data showing
    expect(element).toHaveTextContent('MATH 100');

    // expect not to have COSC 101 in second page, COSC 101 is first page data
    expect(element).not.toHaveTextContent('COSC 101');

    await waitFor(() => {
      const rows = element.querySelectorAll('tbody tr');
      
      // Find the row with the course "MATH 100"
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('MATH 100')) {
              memberRow = row;
          }
      });
      // expect row MATH 100 contains right information
      expect(memberRow.textContent).toContain('MATH 100');
      expect(memberRow.textContent).toContain('Differential Calculus with Applications to Physical Sciences and Engineering');
      expect(memberRow.textContent).toContain('MATH IS MATH');
      // expect row MATH 100 does not contains wrong information
      expect(memberRow.textContent).not.toContain('COSC 101');

      // toggleButton is "Inactive" button
      const toggleButton = memberRow.querySelector('button:nth-child(2)');
      expect(toggleButton.textContent).toContain('Inactive'); // expect its inactive button


      // MATH 100 has true, so active button should have disabled (it means button is not clickable)
      const activeButton = memberRow.querySelector('button.active-button');
      expect(activeButton).toBeDisabled();

      // Click the inactive button
      fireEvent.click(toggleButton);

    });

    await waitFor(() => {
      // Request MATH 100 (courseId 11) status changing to false
      expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/api/DeptStatusChangeCourse',
          { courseid: 11, newStatus: false },
          { headers: { Authorization: 'Bearer mocked-token' } }
      );
    });
    await waitFor(() => {
      // Check again after request
      const rows = element.querySelectorAll('tbody tr');
      let memberRow;
      rows.forEach(row => {
          if (row.textContent.includes('MATH 100')) {
              memberRow = row;
          }
      });
      // deactive is requested, so inative button is not having disabled property making button unclickable
      const inactiveButton = memberRow.querySelector('button.inactive-button');
      expect(inactiveButton).toBeDisabled();
    });
    const prevPageButton = element.querySelector('.pagination .prev a') || element.querySelector('.pagination li:first-child a');
    fireEvent.click(prevPageButton);
  })
});
