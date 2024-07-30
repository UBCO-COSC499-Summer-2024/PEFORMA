import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { AuthProvider } from '../../../../app/frontend/src/JS/common/AuthContext';
import DeptCourseList from '../../../../app/frontend/src/JS/Department/DeptCourseList';
import DeptMemberList from '../../../../app/frontend/src/JS/Department/DeptMemberList';
import DeptServiceRoleList from '../../../../app/frontend/src/JS/Department/DeptServiceRoleList';
import DeptTeachingAssignmentDetail from '../../../../app/frontend/src/JS/Department/DeptTeachingAssignmentDetail';
import { requestSort, sortItems } from '../../../../app/frontend/src/JS/common/utils';

// Create a history object
const history = createMemoryHistory();

// Mock the API calls and router hooks
jest.mock('../../../../app/frontend/src/JS/common/utils', () => ({
  ...jest.requireActual('../../../../app/frontend/src/JS/common/utils'),
  fetchWithAuth: jest.fn(),
  checkAccess: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
  useParams: () => ({}),
  useRouteMatch: () => ({ url: '/' }),
  useHistory: () => history,
}));

describe('Sorting functionality', () => {
  const mockAuthToken = { token: 'mock-token' };
  const mockAccountLogInType = 1;
  let Component;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const AllTheProviders = ({ children }) => {
    return (
      <Router history={history}>
        <AuthProvider value={{ authToken: mockAuthToken, accountLogInType: mockAccountLogInType }}>
          {children}
        </AuthProvider>
      </Router>
    );
  };

  const renderComponent = () => {
    return render(<Component />, { wrapper: AllTheProviders });
  };

  describe('DeptCourseList', () => {
    beforeEach(() => {
      const mockCourses = [
        { id: 1, courseCode: 'COSC 111', title: 'Programming I', status: true },
        { id: 2, courseCode: 'COSC 121', title: 'Programming II', status: false },
        { id: 3, courseCode: 'MATH 100', title: 'Calculus I', status: true },
      ];

      jest.spyOn(React, 'useState').mockImplementation(() => [
        { courses: mockCourses, coursesCount: mockCourses.length, perPage: 10, currentPage: 1 },
        jest.fn(),
      ]);

      Component = DeptCourseList;
      renderComponent();
    });

    test('sorting functionality', () => {
      const rows = () => screen.getAllByRole('row').slice(1); // exclude header row

      // Test sorting by course code (ascending)
      fireEvent.click(screen.getByText('Course').nextSibling);
      expect(rows()[0]).toHaveTextContent('COSC 111');
      expect(rows()[1]).toHaveTextContent('COSC 121');
      expect(rows()[2]).toHaveTextContent('MATH 100');

      // Test sorting by course code (descending)
      fireEvent.click(screen.getByText('Course').nextSibling);
      expect(rows()[0]).toHaveTextContent('MATH 100');
      expect(rows()[1]).toHaveTextContent('COSC 121');
      expect(rows()[2]).toHaveTextContent('COSC 111');
    
      // Test sorting by title (ascending)
      fireEvent.click(screen.getByText('Title').nextSibling);
      expect(rows()[0]).toHaveTextContent('Calculus I');
      expect(rows()[1]).toHaveTextContent('Programming I');
      expect(rows()[2]).toHaveTextContent('Programming II');

      // Test sorting by title (descending)
      fireEvent.click(screen.getByText('Title').nextSibling);
      expect(rows()[0]).toHaveTextContent('Programming II');
      expect(rows()[1]).toHaveTextContent('Programming I');
      expect(rows()[2]).toHaveTextContent('Calculus I');
    
      // Test sorting by status (ascending)
      fireEvent.click(screen.getByText('Status').nextSibling);
      expect(rows()[0]).toHaveTextContent('Inactive');
      expect(rows()[1]).toHaveTextContent('Active');
      expect(rows()[2]).toHaveTextContent('Active');

      // Test sorting by status (descending)
      fireEvent.click(screen.getByText('Status').nextSibling);
      expect(rows()[0]).toHaveTextContent('Active');
      expect(rows()[1]).toHaveTextContent('Active');
      expect(rows()[2]).toHaveTextContent('Inactive');
    });
  });

  describe('DeptMemberList', () => {
    beforeEach(() => {
      const mockMembers = [
        { name: 'John Doe', ubcid: '12345', department: 'Computer Science', email: 'john@example.com' },
        { name: 'Jane Smith', ubcid: '67890', department: 'Mathematics', email: 'jane@example.com' },
        { name: 'Bob Johnson', ubcid: '11111', department: 'Physics', email: 'bob@example.com' },
      ];

      jest.spyOn(React, 'useState').mockImplementation(() => [
        { members: mockMembers, membersCount: mockMembers.length, perPage: 10, currentPage: 1 },
        jest.fn(),
      ]);

      Component = DeptMemberList;
      renderComponent();
    });

    test('sorting functionality', () => {
      const rows = () => screen.getAllByRole('row').slice(1); // exclude header row

      // Test sorting by name (ascending)
      fireEvent.click(screen.getByText('Name').nextSibling);
      expect(rows()[0]).toHaveTextContent('Bob Johnson');
      expect(rows()[1]).toHaveTextContent('Jane Smith');
      expect(rows()[2]).toHaveTextContent('John Doe');

      // Test sorting by name (descending)
      fireEvent.click(screen.getByText('Name').nextSibling);
      expect(rows()[0]).toHaveTextContent('John Doe');
      expect(rows()[1]).toHaveTextContent('Jane Smith');
      expect(rows()[2]).toHaveTextContent('Bob Johnson');
    
      // Test sorting by UBC ID (ascending)
      fireEvent.click(screen.getByText('UBC ID').nextSibling);
      expect(rows()[0]).toHaveTextContent('11111');
      expect(rows()[1]).toHaveTextContent('12345');
      expect(rows()[2]).toHaveTextContent('67890');

      // Test sorting by UBC ID (descending)
      fireEvent.click(screen.getByText('UBC ID').nextSibling);
      expect(rows()[0]).toHaveTextContent('67890');
      expect(rows()[1]).toHaveTextContent('12345');
      expect(rows()[2]).toHaveTextContent('11111');
    
      // Test sorting by department (ascending)
      fireEvent.click(screen.getByText('Department').nextSibling);
      expect(rows()[0]).toHaveTextContent('Computer Science');
      expect(rows()[1]).toHaveTextContent('Mathematics');
      expect(rows()[2]).toHaveTextContent('Physics');

      // Test sorting by department (descending)
      fireEvent.click(screen.getByText('Department').nextSibling);
      expect(rows()[0]).toHaveTextContent('Physics');
      expect(rows()[1]).toHaveTextContent('Mathematics');
      expect(rows()[2]).toHaveTextContent('Computer Science');
    });
  });

  describe('DeptServiceRoleList', () => {
    beforeEach(() => {
      const mockRoles = [
        { id: 1, name: 'Advisor', department: 'Computer Science', status: true },
        { id: 2, name: 'Coordinator', department: 'Mathematics', status: false },
        { id: 3, name: 'Lab Assistant', department: 'Physics', status: true },
      ];

      jest.spyOn(React, 'useState').mockImplementation(() => [
        { roles: mockRoles, rolesCount: mockRoles.length, perPage: 10, currentPage: 1 },
        jest.fn(),
      ]);

      Component = DeptServiceRoleList;
      renderComponent();
    });

    test('sorting functionality', () => {
      const rows = () => screen.getAllByRole('row').slice(1); // exclude header row

      // Test sorting by role name (ascending)
      fireEvent.click(screen.getByText('Role').nextSibling);
      expect(rows()[0]).toHaveTextContent('Advisor');
      expect(rows()[1]).toHaveTextContent('Coordinator');
      expect(rows()[2]).toHaveTextContent('Lab Assistant');

      // Test sorting by role name (descending)
      fireEvent.click(screen.getByText('Role').nextSibling);
      expect(rows()[0]).toHaveTextContent('Lab Assistant');
      expect(rows()[1]).toHaveTextContent('Coordinator');
      expect(rows()[2]).toHaveTextContent('Advisor');
    
      // Test sorting by department (ascending)
      fireEvent.click(screen.getByText('Department').nextSibling);
      expect(rows()[0]).toHaveTextContent('Computer Science');
      expect(rows()[1]).toHaveTextContent('Mathematics');
      expect(rows()[2]).toHaveTextContent('Physics');

      // Test sorting by department (descending)
      fireEvent.click(screen.getByText('Department').nextSibling);
      expect(rows()[0]).toHaveTextContent('Physics');
      expect(rows()[1]).toHaveTextContent('Mathematics');
      expect(rows()[2]).toHaveTextContent('Computer Science');
    
      // Test sorting by status (ascending)
      fireEvent.click(screen.getByText('Status').nextSibling);
      expect(rows()[0]).toHaveTextContent('Inactive');
      expect(rows()[1]).toHaveTextContent('Active');
      expect(rows()[2]).toHaveTextContent('Active');

      // Test sorting by status (descending)
      fireEvent.click(screen.getByText('Status').nextSibling);
      expect(rows()[0]).toHaveTextContent('Active');
      expect(rows()[1]).toHaveTextContent('Active');
      expect(rows()[2]).toHaveTextContent('Inactive');
    });
  });

  describe('DeptTeachingAssignmentDetail', () => {
    beforeEach(() => {
      jest.spyOn(React, 'useState').mockImplementation(() => [
        { 
          courses: [
            { id: 1, courseCode: 'COSC 111', courseName: 'Programming I', instructor: 'John Doe', email: 'john@example.com' },
            { id: 2, courseCode: 'COSC 121', courseName: 'Programming II', instructor: 'Jane Smith', email: 'jane@example.com' },
            { id: 3, courseCode: 'COSC 222', courseName: 'Data Structures', instructor: 'Bob Johnson', email: 'bob@example.com' },
          ],
          totalCoursesCount: 3,
          perPage: 10,
          currentPage: 1,
        },
        jest.fn(),
      ]);

      Component = DeptTeachingAssignmentDetail;
      renderComponent();
    });

    test('sorting functionality', () => {
      const rows = () => screen.getAllByRole('row').slice(1); // exclude header row

      // Test sorting by instructor (ascending)
      fireEvent.click(screen.getByText('Instructor').nextSibling);
      expect(rows()[0]).toHaveTextContent('Bob Johnson');
      expect(rows()[1]).toHaveTextContent('Jane Smith');
      expect(rows()[2]).toHaveTextContent('John Doe');

      // Test sorting by instructor (descending)
      fireEvent.click(screen.getByText('Instructor').nextSibling);
      expect(rows()[0]).toHaveTextContent('John Doe');
      expect(rows()[1]).toHaveTextContent('Jane Smith');
      expect(rows()[2]).toHaveTextContent('Bob Johnson');

      // Test sorting by course code (ascending)
      fireEvent.click(screen.getByText('Course Code').nextSibling);
      expect(rows()[0]).toHaveTextContent('COSC 111');
      expect(rows()[1]).toHaveTextContent('COSC 121');
      expect(rows()[2]).toHaveTextContent('COSC 222');

      // Test sorting by course code (descending)
      fireEvent.click(screen.getByText('Course Code').nextSibling);
      expect(rows()[0]).toHaveTextContent('COSC 222');
      expect(rows()[1]).toHaveTextContent('COSC 121');
      expect(rows()[2]).toHaveTextContent('COSC 111');

      // Test sorting by course name (ascending)
      fireEvent.click(screen.getByText('Course Name').nextSibling);
      expect(rows()[0]).toHaveTextContent('Data Structures');
      expect(rows()[1]).toHaveTextContent('Programming I');
      expect(rows()[2]).toHaveTextContent('Programming II');

      // Test sorting by course name (descending)
      fireEvent.click(screen.getByText('Course Name').nextSibling);
      expect(rows()[0]).toHaveTextContent('Programming II');
      expect(rows()[1]).toHaveTextContent('Programming I');
      expect(rows()[2]).toHaveTextContent('Data Structures');
    });
  });

  test('requestSort function', () => {
    // Mock the setState function
    const mockSetSortConfig = jest.fn();
    
    // Initial sort configuration
    const mockSortConfig = { key: null, direction: 'ascending' };

    // Test initial sort (should set to ascending)
    requestSort(mockSortConfig, mockSetSortConfig, 'name');
    // Check if setState was called with the correct arguments
    expect(mockSetSortConfig).toHaveBeenCalledWith({ key: 'name', direction: 'ascending' });

    // Test toggling sort direction (should change to descending)
    requestSort({ key: 'name', direction: 'ascending' }, mockSetSortConfig, 'name');
    // Check if setState was called to change direction to descending
    expect(mockSetSortConfig).toHaveBeenCalledWith({ key: 'name', direction: 'descending' });
  });

  test('sortItems function', () => {
    // Sample data for sorting
    const items = [
      { name: 'John', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
    ];

    // Test sorting by name in ascending order
    const sortedByNameAsc = sortItems(items, { key: 'name', direction: 'ascending' });
    expect(sortedByNameAsc[0].name).toBe('Alice');
    expect(sortedByNameAsc[1].name).toBe('Bob');
    expect(sortedByNameAsc[2].name).toBe('John');

    // Test sorting by name in descending order
    const sortedByNameDesc = sortItems(items, { key: 'name', direction: 'descending' });
    expect(sortedByNameDesc[0].name).toBe('John');
    expect(sortedByNameDesc[1].name).toBe('Bob');
    expect(sortedByNameDesc[2].name).toBe('Alice');

    // Test sorting by age in ascending order
    const sortedByAgeAsc = sortItems(items, { key: 'age', direction: 'ascending' });
    expect(sortedByAgeAsc[0].age).toBe(25);
    expect(sortedByAgeAsc[1].age).toBe(30);
    expect(sortedByAgeAsc[2].age).toBe(35);

    // Test sorting by age in descending order
    const sortedByAgeDesc = sortItems(items, { key: 'age', direction: 'descending' });
    expect(sortedByAgeDesc[0].age).toBe(35);
    expect(sortedByAgeDesc[1].age).toBe(30);
    expect(sortedByAgeDesc[2].age).toBe(25);
  });
});
