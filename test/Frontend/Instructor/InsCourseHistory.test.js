import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import InsCourseHistory from '../../../app/frontend/src/JS/Instructor/InsCourseHistory';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
useAuth.mockReturnValue({
  profileId: { profileId: 'mocked-profileId'},
  accountType: { accountType: 'mocked-accountType' },
});
axios.get.mockResolvedValue({"data":{"history":[{}], entryCount:0, perPage: 10, currentPage: 1}});

test('Checks if data exists', async () => {
    await act(async () => {
        render(<MemoryRouter><InsCourseHistory/></MemoryRouter>);
    });

    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i].innerHTML).toBeDefined();
    }
});