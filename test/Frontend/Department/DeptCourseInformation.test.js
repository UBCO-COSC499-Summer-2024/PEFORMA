import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptCourseInformation from '../../../app/frontend/src/JS/Department/DeptCourseInformation';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
useAuth.mockReturnValue({
    authToken: { token: 'mocked-token' },
    profileId: { profileId: 'mocked-profileId'},
    accountType: { accountType: 'mocked-accountType' },
  
});

axios.get.mockResolvedValue({"data":{"history":[{instructorID:1, instructorName:"dohn joe", session:"2024S", term:2, score:11, term_num:1}], entryCount:0, perPage: 10, currentPage: 1, courseID: 1, courseCode: "123", latestTerm:20244, courseName:"Hi", courseDescription:"what", division:"COSC", avgScore:11}});


test('Checks if buttons exist', async () => {
    await act(async () => {
        render(<MemoryRouter><DeptCourseInformation/></MemoryRouter>);
    });
    const edit = await screen.getByRole('button', { name: /edit/i});
    const deactivate = await screen.getByRole('button', { name: /deactivate/i});
    expect(edit).toBeInTheDocument();
    expect(deactivate).toBeInTheDocument();
});
test('Checks if data exists', async () => {
    await act(async () => {
        render(<MemoryRouter><DeptCourseInformation/></MemoryRouter>);
    });

    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i].innerHTML).toBeDefined();
    }
});