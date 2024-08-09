import React from 'react';
import '@testing-library/jest-dom'; 
import { render, screen, fireEvent } from '@testing-library/react'; 
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from '../../../app/frontend/src/JS/common/AuthContext'; 
import PerformanceDepartmentPage from '../../../app/frontend/src/JS/Department/DeptPerformancePage'; 
import * as utils from '../../../app/frontend/src/JS/common/utils'; 

// Mock the modules and functions
jest.mock('../../../app/frontend/src/JS/common/AuthContext', () => ({
  ...jest.requireActual('../../../app/frontend/src/JS/common/AuthContext'),
  useAuth: () => ({
    authToken: { token: 'mock-token' }, 
    accountLogInType: 1,
  }),
}));

jest.mock('../../../app/frontend/src/JS/common/utils', () => ({
  ...jest.requireActual('../../../app/frontend/src/JS/common/utils'), 
  checkAccess: jest.fn(), 
  fetchWithAuth: jest.fn(), 
  getCurrentMonthName: jest.fn(() => 'August'), 
  getTermString: jest.fn(() => '2024 Summer Term 2'), 
  downloadCSV: jest.fn(), 
}));

// Mock components that are not essential for the test
jest.mock('../../../app/frontend/src/JS/common/SideBar', () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock('../../../app/frontend/src/JS/common/TopBar', () => () => <div data-testid="topbar">TopBar</div>);
jest.mock('../../../app/frontend/src/JS/Department/PerformanceImports/DeptDivisionTable', () => ({ departmentName }) => <div>{departmentName}</div>);
jest.mock('../../../app/frontend/src/JS/Department/PerformanceImports/DeptBenchMark', () => () => <div>Benchmark</div>);
jest.mock('../../../app/frontend/src/JS/Department/PerformanceImports/DeptGoodBadBoard', () => () => <div>Leaderboard</div>);

describe('PerformanceDepartmentPage', () => {
  // Mock data representing API responses
  const mockData = {
    cosc: [
      { id: 1, name: 'COSC 111', instructor: 'Dr. Smith', performanceScore: 85, failRate: 0.05, retentionRate: 0.95 },
      { id: 2, name: 'COSC 222', instructor: 'Prof. Johnson', performanceScore: 78, failRate: 0.08, retentionRate: 0.92 }
    ],
    math: [
      { id: 3, name: 'MATH 100', instructor: 'Dr. Brown', performanceScore: 92, failRate: 0.03, retentionRate: 0.97 },
      { id: 4, name: 'MATH 200', instructor: 'Prof. Davis', performanceScore: 88, failRate: 0.06, retentionRate: 0.94 }
    ],
    phys: [
      { id: 5, name: 'PHYS 111', instructor: 'Dr. Wilson', performanceScore: 80, failRate: 0.07, retentionRate: 0.93 },
      { id: 6, name: 'PHYS 222', instructor: 'Prof. Taylor', performanceScore: 82, failRate: 0.06, retentionRate: 0.94 }
    ],
    stat: [
      { id: 7, name: 'STAT 230', instructor: 'Dr. Lee', performanceScore: 87, failRate: 0.04, retentionRate: 0.96 },
      { id: 8, name: 'STAT 330', instructor: 'Prof. Garcia', performanceScore: 90, failRate: 0.02, retentionRate: 0.98 }
    ],
    benchmark: [
      { name: 'John Doe', shortage: 120 },
      { name: 'Jane Smith', shortage: 80 }
    ],
    leaderboard: {
      top: [
        { name: 'Dr. Brown', score: 95 },
        { name: 'Prof. Garcia', score: 93 }
      ],
      bottom: [
        { name: 'Prof. Johnson', score: 72 },
        { name: 'Dr. Wilson', score: 75 }
      ]
    }
  };

  // Setup mocks before each test
  beforeEach(() => {
    utils.fetchWithAuth.mockImplementation((url) => {
      // Simulate different API responses based on the request URL
      if (url.includes('coursePerformance?divisionId=1')) return Promise.resolve({ courses: mockData.cosc, currentTerm: 20244 });
      if (url.includes('coursePerformance?divisionId=2')) return Promise.resolve({ courses: mockData.math });
      if (url.includes('coursePerformance?divisionId=3')) return Promise.resolve({ courses: mockData.phys });
      if (url.includes('coursePerformance?divisionId=4')) return Promise.resolve({ courses: mockData.stat });
      if (url.includes('benchmark')) return Promise.resolve({ people: mockData.benchmark });
      if (url.includes('deptLeaderBoard')) return Promise.resolve(mockData.leaderboard);
    });
  });

  it('renders without crashing', async () => {
    // Render the component wrapped in necessary context providers
    render(
      <BrowserRouter>
        <AuthProvider>
          <PerformanceDepartmentPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Verify the main component text appears, indicating it has rendered
    expect(await screen.findByText('Department Performance Overview')).toBeInTheDocument();
  });

  it('exports data to CSV when download button is clicked', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <PerformanceDepartmentPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Find the download button and simulate a click event
    const downloadButton = await screen.findByTestId('download-button');
    fireEvent.click(downloadButton);

    // Assert that downloadCSV is called with the correct arguments
    expect(utils.downloadCSV).toHaveBeenCalled();
    
    const csvArg = utils.downloadCSV.mock.calls[0][0]; // Capture CSV data argument

    // Check CSV content structure
    expect(csvArg).toContain('Computer Science Courses:');
    expect(csvArg).toContain('Mathematics Courses:');
    expect(csvArg).toContain('Physics Courses:');
    expect(csvArg).toContain('Statistics Courses:');
    expect(csvArg).toContain('Benchmark - August:');
    expect(csvArg).toContain('Top 5 Instructors:');
    expect(csvArg).toContain('Bottom 5 Instructors:');

    // Verify specific data entries are present in CSV
    expect(csvArg).toContain('COSC 111,Dr. Smith,85,0.05,0.95');
    expect(csvArg).toContain('MATH 200,Prof. Davis,88,0.06,0.94');
    expect(csvArg).toContain('PHYS 222,Prof. Taylor,82,0.06,0.94');
    expect(csvArg).toContain('STAT 330,Prof. Garcia,90,0.02,0.98');
    expect(csvArg).toContain('John Doe,2 hours 0 minutes');
    expect(csvArg).toContain('Dr. Brown,95');
    expect(csvArg).toContain('Prof. Johnson,72');

    // Check the expected filename for the CSV
    expect(utils.downloadCSV.mock.calls[0][1]).toBe('2024 Summer Term 2 Performance Overview.csv');
  });
});
