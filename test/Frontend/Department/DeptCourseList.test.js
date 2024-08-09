import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptCourseList from '../../../app/frontend/src/JS/Department/DeptCourseList';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import * as utils from '../../../app/frontend/src/JS/common/utils';

// Mock axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

// Mocking sidebar
jest.mock('../../../app/frontend/src/JS/common/SideBar.js', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mock Sidebar</div>),
}));

// Mocking topbar for testing search function
jest.mock('../../../app/frontend/src/JS/common/TopBar.js', () => ({
  __esModule: true,
  default: jest.fn(({ onSearch }) => (
    <div className="topbar-search">
      <input
        type="text"
        placeholder="Search by Subject and Title"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="logout">Logout</div>
    </div>
  )),
}));

jest.mock('../../../app/frontend/src/JS/common/utils', () => ({
  ...jest.requireActual('../../../app/frontend/src/JS/common/utils'),
  downloadCSV: jest.fn(),
}));

describe('DeptCourseList', () => {
  let element;

  beforeEach(() => {
    useAuth.mockReturnValue({
      // Mock token
      authToken: { token: 'mocked-token' },
    });
    axios.get.mockImplementation(() =>
      Promise.resolve({
        // Set mock data
        data: {
          currentPage: 1,
          perPage: 10,
          coursesCount: 12,
          currentTerm: 20244,
          courses: [
            {
              id: 1,
              courseCode: 'COSC 101',
              title: 'Digital Citizenship',
              description: 'description testing',
              status: false,
            },
            {
              id: 2,
              courseCode: 'COSC 111',
              title: 'Computer Programming I',
              description: 'description testing',
              status: true,
            },
            {
              id: 3,
              courseCode: 'COSC 123',
              title: 'Computer Creativity',
              description: 'description testing',
              status: false,
            },
            {
              id: 4,
              courseCode: 'COSC 304',
              title: 'Introduction to Database',
              description:
                "Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.",
              status: false,
            },
            {
              id: 5,
              courseCode: 'COSC 211',
              title: 'Machine Architecture',
              description: 'description testing',
              status: true,
            },
            {
              id: 6,
              courseCode: 'COSC 221',
              title: 'Introduction to Discrete Structures',
              description: 'description testing',
              status: true,
            },
            {
              id: 7,
              courseCode: 'STAT 121',
              title: 'Elementary Statistics',
              description: 'description testing',
              status: true,
            },
            {
              id: 8,
              courseCode: 'PHYS 205',
              title: 'Introduction to Mathematical Statistics',
              description: 'description testing',
              status: true,
            },
            {
              id: 9,
              courseCode: 'PHYS 400',
              title: 'Statistical Communication and Consulting',
              description: 'description testing',
              status: false,
            },
            {
              id: 10,
              courseCode: 'COSC 341',
              title: 'Human computer Interaction',
              description: 'description testing',
              status: true,
            },
            {
              id: 11,
              courseCode: 'MATH 100',
              title:
                'Differential Calculus with Applications to Physical Sciences and Engineering',
              description: 'MATH IS MATH',
              status: false,
            },
            {
              id: 12,
              courseCode: 'TEST 17',
              title: 'Testing 123',
              description: 'description testing',
              status: true,
            },
          ],
        },
      })
    );
    render(
      // Render DeptCourseList
      <MemoryRouter>
        <DeptCourseList />
      </MemoryRouter>
    );
    element = document.getElementById('dept-course-list-test-content'); // Get element by id
  });

  test('Testing rendering with mock data course list', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(element).toHaveTextContent('List of Courses (7 Active in current)'); // 5 are not active in 12 courses, so 7 active should be expected

    // Expect these courses to be in element
    expect(element).toHaveTextContent('COSC 111');
    expect(element).toHaveTextContent('STAT 121');
    expect(element).toHaveTextContent('PHYS 205');
    expect(element).toHaveTextContent('COSC 123');
    expect(element).toHaveTextContent('COSC 341');

    expect(element).not.toHaveTextContent('COSC 50000'); // No data in mock data
    expect(element).not.toHaveTextContent('TEST 17'); // Should be in second page
    expect(element).not.toHaveTextContent('MATH 100'); // Should be in second page

    expect(element).toHaveTextContent('Digital Citizenship');
    expect(element).toHaveTextContent('Computer Creativity');
    expect(element).toHaveTextContent('Elementary Statistics');

    // Random words that are not in mock data, expecting not to show up
    expect(element).not.toHaveTextContent('Some random test that should not be in');

    expect(element).toHaveTextContent(
      "Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies."
    );
    expect(element).toHaveTextContent('description testing');

    // Check Active and InActive text in element
    expect(element).toHaveTextContent('Active');
    expect(element).toHaveTextContent('Inactive');
  });

  test('Check if pagination exists', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const paginationElement = element.querySelector('.pagination'); // Find pagination
    expect(paginationElement).toBeInTheDocument(); // Expect pagination exists
  });

  test('Test next button in pagination', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    const nextPageButton =
      element.querySelector('.pagination .next a') ||
      element.querySelector('.pagination li:last-child a'); // Find next page button
    fireEvent.click(nextPageButton); // Simulate clicking next page button

    await waitFor(() => {
      // Now show only page 2 contents
      expect(element).toHaveTextContent('MATH 100');
      expect(element).toHaveTextContent('TEST 17');

      // COSC 111 is on the first page, so not.toHaveTextContext
      expect(element).not.toHaveTextContent('COSC 111');

      // Check second page data renders well
      expect(element).toHaveTextContent('MATH IS MATH');
      expect(element).toHaveTextContent(
        'Differential Calculus with Applications to Physical Sciences and Engineering'
      );
      expect(element).toHaveTextContent('Testing 123');
      expect(element).toHaveTextContent('description testing');
    });
  });

  test('Test prev button in pagination', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));

    const prevPageButton =
      element.querySelector('.pagination .prev a') ||
      element.querySelector('.pagination li:first-child a'); // Find previous page button
    fireEvent.click(prevPageButton); // Simulate clicking previous page button

    await waitFor(() => {
      // Now show page 1 again
      expect(element).toHaveTextContent('COSC 304');
      expect(element).toHaveTextContent('PHYS 205');

      // MATH 100 is on page 2, so not.toHaveTextContext
      expect(element).not.toHaveTextContent('MATH 100');

      // Check if page renders first-page data
      expect(element).toHaveTextContent('Introduction to Database');
      expect(element).toHaveTextContent(
        "Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies."
      );
      expect(element).toHaveTextContent('Introduction to Mathematical Statistics');
      expect(element).toHaveTextContent('description testing');
    });
  });

  test('Check if search bar exists', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(5));

    const searchInput = screen.getByPlaceholderText('Search by Subject and Title'); // Find search bar by placeholder
    expect(searchInput).toBeInTheDocument(); // Expect search bar exists on the screen
  });

  test('Test search functionality', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(6));

    const searchInput = screen.getByPlaceholderText('Search by Subject and Title'); // Find search bar by placeholder
    fireEvent.change(searchInput, { target: { value: 'Computer' } }); // Type Computer in search bar

    // Search Computer so only 3 courses (COSC 111, COSC 123, COSC 341) will appear on the screen, other courses will not be present
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 3 rows (COSC 111, COSC 123, COSC 341) + 1 row (<#><Course><Title><Description>) <- top default row

      expect(element).toHaveTextContent('COSC 111');
      expect(element).toHaveTextContent('Computer Programming I');

      expect(element).toHaveTextContent('COSC 123');
      expect(element).toHaveTextContent('Computer Creativity');

      expect(element).toHaveTextContent('COSC 341');
      expect(element).toHaveTextContent('Human computer Interaction');

      // STAT 121, Elementary Statistics should not be present on the screen course list
      expect(element).not.toHaveTextContent('STAT 121');
      expect(element).not.toHaveTextContent('Elementary Statistics');

      expect(element).not.toHaveTextContent('RANDOM VALUE');
    });
  });

  test('Test export functionality', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(7));

    // Mock current term
    const mockCurrentTerm = '2024 Summer Term 2';

    // Find and click the export button
    const exportButton = screen.getByTestId('download-button');
    fireEvent.click(exportButton);

    // Check if downloadCSV was called with the correct arguments
    expect(utils.downloadCSV).toHaveBeenCalledWith(
      '#, Course Code,Title,Description,Status\n' +
        '1,COSC 101,Digital Citizenship,"description testing",Inactive\n' +
        '2,COSC 111,Computer Programming I,"description testing",Active\n' +
        '3,COSC 123,Computer Creativity,"description testing",Inactive\n' +
        '4,COSC 304,Introduction to Database,"Databases from a user\'s perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.",Inactive\n' +
        '5,COSC 211,Machine Architecture,"description testing",Active\n' +
        '6,COSC 221,Introduction to Discrete Structures,"description testing",Active\n' +
        '7,STAT 121,Elementary Statistics,"description testing",Active\n' +
        '8,PHYS 205,Introduction to Mathematical Statistics,"description testing",Active\n' +
        '9,PHYS 400,Statistical Communication and Consulting,"description testing",Inactive\n' +
        '10,COSC 341,Human computer Interaction,"description testing",Active\n' +
        '11,MATH 100,Differential Calculus with Applications to Physical Sciences and Engineering,"MATH IS MATH",Inactive\n' +
        '12,TEST 17,Testing 123,"description testing",Active\n',
      `${mockCurrentTerm} Course List.csv`
    );
  });
});
