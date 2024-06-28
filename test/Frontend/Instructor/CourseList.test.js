import {act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseList from '../../../app/frontend/src/JS/Instructor/CourseList';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { AuthProvider } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
axios.get.mockResolvedValue({"data":{"courses":[], divisionCoursesCount:0, perPage: 5, currentPage: 1}});


const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

test('Testing if dropdown exists', async () => {
  renderWithProviders(<CourseList />)
  expect(screen.getByRole('combobox')).toBeInTheDocument();
}

)

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


