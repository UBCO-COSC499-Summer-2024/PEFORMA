import {act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseList from '../../../app/frontend/src/JS/Instructor/CourseList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { AuthProvider } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');

const mockCourseData = {
  division:"COSC", divisionLabel:"Computer Science",
  divisionCoursesCount: 1,
  perPage: 10,
  currentPage: 1,
  courses: [
    {
      id: 'COSC 101',
      title: 'Introduction to Computer Science',
      instructor: ['John Doe'],
      ubcid: ['1'],
      email: ['johndoe@example.com']
    }
  ]
};
const mockMathCoursesData = {
  division:"MATH", divisionLabel:"Mathmatics",
  divisionCoursesCount: 1,
  perPage: 10,
  currentPage: 1,
  courses: [
    {
      id: 'MATH101',
      title: 'Calculus I',
      instructor: ['Alice Smith'],
      ubcid: [3],
      email: ['test@asd.com']
    }
  ]
};

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('CourseList', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue((url) => {
      if (url.includes('division=MATH')) {
        return Promise.resolve({ data: mockMathCoursesData });
      }
      return Promise.resolve({ data: mockCourseData });
    });
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
  
  
});