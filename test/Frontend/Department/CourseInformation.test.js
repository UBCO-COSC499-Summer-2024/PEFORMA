import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseInformation from '../../../app/frontend/src/JS/Department/CourseInformation';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';

jest.mock('axios');
axios.get.mockResolvedValue({"data":{"history":[{}], entryCount:0, perPage: 10, currentPage: 1}});

test('Checks if buttons exist', async () => {
    await act(async () => {
        render(<MemoryRouter><CourseInformation/></MemoryRouter>);
    });
    const edit = await screen.getByRole('button', { name: /edit/i});
    const deactivate = await screen.getByRole('button', { name: /deactivate/i});
    expect(edit).toBeInTheDocument();
    expect(deactivate).toBeInTheDocument();
});
test('Checks if data exists', async () => {
    await act(async () => {
        render(<MemoryRouter><CourseInformation/></MemoryRouter>);
    });

    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i].innerHTML).toBeDefined();
    }
});