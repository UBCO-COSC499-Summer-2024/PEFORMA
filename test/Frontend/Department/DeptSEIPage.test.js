import { fireEvent, render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptSEIPage from '../../../app/frontend/src/JS/Department/DeptSEIPage';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mock axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('DeptSEIPage', () => {
  beforeEach(async () => {
    useAuth.mockReturnValue({ // mock authToken
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId' }
    });
    axios.get.mockResolvedValue({
      data: { // mock data
        courses: [
          { courseId: '1', courseCode: 'COSC 101', instructor: [{ profileId: '1', name: 'Don' }] },
          { courseId: '2', courseCode: 'MATH 499', instructor: [{ profileId: '2', name: 'Math prof' }, { profileId: '5', name: 'David' }] }
        ]
      }
    });

    await act(async () => {
      render( // render DeptSEIPage
        <MemoryRouter>
          <DeptSEIPage />
        </MemoryRouter>
      );
    });
  });

  test('Testing rendering SEI data entry form after selecting MATH 499 and David', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    // find the react-select component for course
    const courseSelect = screen.getByText('Select course');
    expect(courseSelect).toBeInTheDocument();

    // simulate clicking course select
    await act(async () => {
      fireEvent.focus(courseSelect);
      fireEvent.keyDown(courseSelect, { key: 'ArrowDown' });
    });

    // select MATH 499 option and click
    const courseOption = await screen.findByText('MATH 499');
    expect(courseOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(courseOption);
    });

    // find the react-select component for instructor
    const instructorSelect = await screen.findByText('Select instructor');
    expect(instructorSelect).toBeInTheDocument();

    // simulate clicking instructor select
    await act(async () => {
      fireEvent.focus(instructorSelect);
      fireEvent.keyDown(instructorSelect, { key: 'ArrowDown' });
    });

    // select David option and click
    const insOption = await screen.findByText('David');
    expect(insOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(insOption);
    });

    // find each inputs by placeholder
    const Q1Input = screen.getByLabelText('Q 1 Average Score:');
    const Q2Input = screen.getByLabelText('Q 2 Average Score:');
    const Q3Input = screen.getByLabelText('Q 3 Average Score:');
    const Q4Input = screen.getByLabelText('Q 4 Average Score:');
    const Q5Input = screen.getByLabelText('Q 5 Average Score:');
    const Q6Input = screen.getByLabelText('Q 6 Average Score:');
    const retentionRateInput = screen.getByLabelText('Retention Rate of MATH 499');
    const averageGradeInput = screen.getByLabelText('Average Grade of MATH 499');
    const enrollmentRateInput = screen.getByLabelText('Enrollment Rate of MATH 499');
    const failedPercentageInput = screen.getByLabelText('Failed Percentage of MATH 499');

    // expect each input box exists
    expect(Q1Input).toBeInTheDocument();
    expect(Q2Input).toBeInTheDocument();
    expect(Q3Input).toBeInTheDocument();
    expect(Q4Input).toBeInTheDocument();
    expect(Q5Input).toBeInTheDocument();
    expect(Q6Input).toBeInTheDocument();
    expect(retentionRateInput).toBeInTheDocument();
    expect(averageGradeInput).toBeInTheDocument();
    expect(enrollmentRateInput).toBeInTheDocument();
    expect(failedPercentageInput).toBeInTheDocument();
  });
  test('Testing submitting form with selecting COSC 101, professor Don', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(6));
    window.alert = jest.fn(); 

    // find the react-select component for course
    const courseSelect = screen.getByText('Select course');
    expect(courseSelect).toBeInTheDocument();

    // simulate clicking course select
    await act(async () => {
      fireEvent.focus(courseSelect);
      fireEvent.keyDown(courseSelect, { key: 'ArrowDown' });
    });

    // select COSC 101 option and click
    const courseOption = await screen.findByText('COSC 101');
    expect(courseOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(courseOption);
    });

    // find the react-select component for instructor
    const instructorSelect = await screen.findByText('Select instructor');
    expect(instructorSelect).toBeInTheDocument();

    // simulate clicking instructor select
    await act(async () => {
      fireEvent.focus(instructorSelect);
      fireEvent.keyDown(instructorSelect, { key: 'ArrowDown' });
    });

    // select Don option and click
    const insOption = await screen.findByText('Don');
    expect(insOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(insOption);
    });

    // find each inputs by placeholder
    const Q1Input = screen.getByLabelText('Q 1 Average Score:');
    const Q2Input = screen.getByLabelText('Q 2 Average Score:');
    const Q3Input = screen.getByLabelText('Q 3 Average Score:');
    const Q4Input = screen.getByLabelText('Q 4 Average Score:');
    const Q5Input = screen.getByLabelText('Q 5 Average Score:');
    const Q6Input = screen.getByLabelText('Q 6 Average Score:');
    const retentionRateInput = screen.getByLabelText('Retention Rate of COSC 101');
    const averageGradeInput = screen.getByLabelText('Average Grade of COSC 101');
    const enrollmentRateInput = screen.getByLabelText('Enrollment Rate of COSC 101');
    const failedPercentageInput = screen.getByLabelText('Failed Percentage of COSC 101');

    await act(async () => { // input different values in each different input box
      fireEvent.change(Q1Input, { target: { value: '95' } });
      fireEvent.change(Q2Input, { target: { value: '90' } });
      fireEvent.change(Q3Input, { target: { value: '85' } });
      fireEvent.change(Q4Input, { target: { value: '75' } });
      fireEvent.change(Q5Input, { target: { value: '77' } });
      fireEvent.change(Q6Input, { target: { value: '50' } });
      fireEvent.change(retentionRateInput, { target: { value: '90' } });
      fireEvent.change(averageGradeInput, { target: { value: '86' } });
      fireEvent.change(enrollmentRateInput, { target: { value: '92' } });
      fireEvent.change(failedPercentageInput, { target: { value: '4' } });
    });

    const submitButton = screen.getByText('Submit'); // find submit button
    expect(submitButton).toBeInTheDocument(); // simulate clicking submit button

    // expect axios.post to be called one time = submit button has been clicked
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith( // axios.post with postData
      'http://localhost:3001/api/courseEvaluation',
      {
        courseId: '1',  
        profileId: '1', 
        Q1: '95',
        Q2: '90',
        Q3: '85',
        Q4: '75',
        Q5: '77',
        Q6: '50',
        retentionRate: '90',
        averageGrade: '86',
        enrollmentRate: '92',
        failedPercentage: '4'
      },
      { headers: { Authorization: `Bearer mocked-token` } }
    ));

    // check alert message if SEI data is successfully submitted
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('SEI data submitted successfully.'));

    // check if it resets after submit
    const Q1InputAfterSubmit = screen.queryByPlaceholderText('Q1 Average Score');
    expect(Q1InputAfterSubmit).toBeNull();
    });
    test('Testing if cancel button resets input values', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(9));
    window.alert = jest.fn(); 

    // find the react-select component for course
    const courseSelect = screen.getByText('Select course');
    expect(courseSelect).toBeInTheDocument();

    // simulate clicking course select
    await act(async () => {
      fireEvent.focus(courseSelect);
      fireEvent.keyDown(courseSelect, { key: 'ArrowDown' });
    });

    // select COSC 101 option and click
    const courseOption = await screen.findByText('COSC 101');
    expect(courseOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(courseOption);
    });

    // find the react-select component for instructor
    const instructorSelect = await screen.findByText('Select instructor');
    expect(instructorSelect).toBeInTheDocument();

    // simulate clicking instructor select
    await act(async () => {
      fireEvent.focus(instructorSelect);
      fireEvent.keyDown(instructorSelect, { key: 'ArrowDown' });
    });

    // select Don option and click
    const insOption = await screen.findByText('Don');
    expect(insOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(insOption);
    });

    // find each inputs by placeholder
    const Q1Input = screen.getByLabelText('Q 1 Average Score:');
    const Q2Input = screen.getByLabelText('Q 2 Average Score:');
    const Q3Input = screen.getByLabelText('Q 3 Average Score:');
    const Q4Input = screen.getByLabelText('Q 4 Average Score:');
    const Q5Input = screen.getByLabelText('Q 5 Average Score:');
    const Q6Input = screen.getByLabelText('Q 6 Average Score:');
    const retentionRateInput = screen.getByLabelText('Retention Rate of COSC 101');
    const averageGradeInput = screen.getByLabelText('Average Grade of COSC 101');
    const enrollmentRateInput = screen.getByLabelText('Enrollment Rate of COSC 101');
    const failedPercentageInput = screen.getByLabelText('Failed Percentage of COSC 101');

    await act(async () => { // input different values in each input box
      fireEvent.change(Q1Input, { target: { value: '95' } });
      fireEvent.change(Q2Input, { target: { value: '90' } });
      fireEvent.change(Q3Input, { target: { value: '85' } });
      fireEvent.change(Q4Input, { target: { value: '75' } });
      fireEvent.change(Q5Input, { target: { value: '77' } });
      fireEvent.change(Q6Input, { target: { value: '70' } });
      fireEvent.change(retentionRateInput, { target: { value: '90' } });
      fireEvent.change(averageGradeInput, { target: { value: '86' } });
      fireEvent.change(enrollmentRateInput, { target: { value: '92' } });
      fireEvent.change(failedPercentageInput, { target: { value: '4' } });
    });

    const cancelButton = screen.getByText('Cancel'); // find cancel button
    expect(cancelButton).toBeInTheDocument(); // expect cancel button to exist
    
    await act(async () => { // simulate clicking cancel button
      fireEvent.click(cancelButton);
    });

    // check if the form resets after clicking cancel button
    await waitFor(() => {
      expect(screen.getByLabelText('Q 1 Average Score')).toBeNull();
      expect(screen.getByLabelText('Q 2 Average Score')).toBeNull();
      expect(screen.getByLabelText('Q 3 Average Score')).toBeNull();
      expect(screen.getByLabelText('Q 4 Average Score')).toBeNull();
      expect(screen.getByLabelText('Q 5 Average Score')).toBeNull();
      expect(screen.getByLabelText('Q 6 Average Score')).toBeNull();
      expect(screen.getByLabelText('Retention Rate of COSC 101')).toBeNull();
      expect(screen.getByLabelText('Average Grade of COSC 101')).toBeNull();
      expect(screen.getByLabelText('Enrollment Rate of COSC 101')).toBeNull();
      expect(screen.getByLabelText('Failed Percentage of COSC 101')).toBeNull();
    });
  });
  test('Testing react-select search functionality', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(12));
  
    // find the react-select component for course
    const courseSelect = screen.getByText('Select course');
    expect(courseSelect).toBeInTheDocument();
  
    // simulate clicking course select
    await act(async () => {
      fireEvent.focus(courseSelect);
      fireEvent.keyDown(courseSelect, { key: 'ArrowDown' });
    });
  
    // simulate entering MATH to search MATH 499
    const searchInput = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'MATH' } });
    });
  
    // MATH 499 is displayed and COSC 101 is not
    const courseOptionMath = await screen.findByText('MATH 499');
    expect(courseOptionMath).toBeInTheDocument();
    expect(screen.queryByText('COSC 101')).toBeNull();
  
    // select MATH 499 option
    await act(async () => {
      fireEvent.click(courseOptionMath);
    });
  
    // instructor select is rendered after selecting MATH 499
    const instructorSelect = await screen.findByText('Select instructor');
    expect(instructorSelect).toBeInTheDocument();
  });
});
