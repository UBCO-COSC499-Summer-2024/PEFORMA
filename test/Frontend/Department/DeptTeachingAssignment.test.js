import { fireEvent, render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptTeachingAssignment from '../../../app/frontend/src/JS/Department/DeptTeachingAssignment';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mock axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('DeptTeachingAssignment', () => {
  let element;
  
  beforeEach(async () => {
    useAuth.mockReturnValue({ // mock authToken
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId' }
    });
    axios.get.mockResolvedValue({
      data: { // mock data
        "currentTerm": 20243,
        "currentPage": 1,
        "perPage": 10,
        "divisionCoursesCount": 21,
        "teachinginfo": [
          {
            "instructor": "Alice Johnson",
            "ubcid": 72639284,
            "division": "Mathematics",
            "courses": ["MATH 101", "MATH 202"],
            "courseName":["asd", "zxbcv"],
            "courseid": [11, 12],
            "email": "alice.johnson@example.com"
          },
          {
            "instructor": "Bob Smith",
            "ubcid": 38291057,
            "division": "Physics",
            "courses": ["PHYS 201", "PHYS 302"],
            "courseName":["asdf", "gadsfg"],
            "courseid": [21, 22],
            "email": "bob.smith@example.com"
          },
          {
            "instructor": "Teresa Williams",
            "ubcid": 58392047,
            "division": "Computer Science",
            "courses": ["COSC 109", "COSC 210"],
            "courseName":["Test", "test"],
            "courseid": [201, 202],
            "email": "teresa.williams@example.com"
          }
        ]
      }
    });

    await act(async () => {
      render( // render DeptTeachingAssignment page
        <MemoryRouter>
          <DeptTeachingAssignment />
        </MemoryRouter>
      );
    });
    element = document.getElementById('teaching-assignment-test-content'); // set element with id
  });

  test('Testing rendering mock data in computer science overview page', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    //expect info to be rendered correctly
    expect(element).toHaveTextContent("Teaching assignment (2024 Summer Term 1)");
    expect(element).toHaveTextContent("COSC 109");
    expect(element).toHaveTextContent("COSC 210");

    expect(element).toHaveTextContent("Teresa Williams");

    // these courses are not in Computer Science, shouldnt show up 
    expect(element).not.toHaveTextContent("PHYS 201");
    expect(element).not.toHaveTextContent("PHYS 302");
    expect(element).not.toHaveTextContent("MATH 101");
    expect(element).not.toHaveTextContent("MATH 102");
  });
  test('Testing on switching to other division and check if the data renders well', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(6));
    
    // expect COSC courses to be rendered first
    expect(element).toHaveTextContent("COSC 109");
    expect(element).toHaveTextContent("COSC 210");
    
    const select = screen.getByRole('combobox'); // find switching to different division box

    // switch to physics division
    await act(async () => {
      fireEvent.change(select, { target: { value: 'physics' } });
    });

    // wait for axios to be called one more
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(7));

    // expect PHYS courses are now present
    expect(element).toHaveTextContent("PHYS 201");
    expect(element).toHaveTextContent("PHYS 302");

    // non PHYS courses should not be present
    expect(element).not.toHaveTextContent("COSC 109");
    expect(element).not.toHaveTextContent("COSC 210");
    expect(element).not.toHaveTextContent("MATH 101");
    expect(element).not.toHaveTextContent("MATH 102");
  });
});