import {act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseList from '../../../app/frontend/src/JS/Instructor/CourseList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { AuthProvider } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');

axios.get.mockResolvedValue({
  data: {"division":"MATH", "divisionLabel":"Mathmatics", "currentPage":1, "perPage": 10, "divisionCoursesCount":1,
    "courses":[
      { "id": "MATH 100", "title": "Differential Calculus with Applications to Physical Sciences and Engineering", "instructor": ["Brandi Floyd"], "ubcid":[32819340], "email": ["brandi@instructor.ubc.ca"] }
    ]
}
});

const renderWithProviders = (ui, { route = '/?division=COSC' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

test('Testing if dropdown exists', async () => {
  renderWithProviders(<CourseList />, { route: '/?division=MATH' });
  expect(await screen.findByRole('combobox')).toBeInTheDocument();
});

test('Render course list components', async () => {
renderWithProviders(<CourseList />);

await waitFor(() => {
  expect(screen.getByText('List of Courses')).toBeInTheDocument();
});

await waitFor(() => {
  expect(screen.getByText('Course')).toBeInTheDocument();
  expect(screen.getByText('Title')).toBeInTheDocument();
  expect(screen.getByText('Instructor')).toBeInTheDocument();
  expect(screen.getByText('Email')).toBeInTheDocument();
  });
});


test("Testing pagination exists", async () => {
  renderWithProviders(<CourseList />);
  expect(screen.getByText('<')).toBeInTheDocument();
  expect(screen.getByText('>')).toBeInTheDocument();
});
