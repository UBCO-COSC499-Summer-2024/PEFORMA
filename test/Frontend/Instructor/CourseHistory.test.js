import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import CourseHistory from '../../../app/frontend/src/JS/Instructor/CourseHistory';

jest.mock('axios');
axios.get.mockResolvedValue({"data":{"history":[{}], entryCount:0, perPage: 10, currentPage: 1}});

test('Checks if data exists', async () => {
    await act(async () => {
        render(<MemoryRouter><CourseHistory/></MemoryRouter>);
    });

    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i].innerHTML).toBeDefined();
    }
});