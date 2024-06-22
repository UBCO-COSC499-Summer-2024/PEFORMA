import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseInformation from '../../../app/frontend/src/JS/Department/CourseInformation';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';

jest.mock('axios');
axios.get.mockResolvedValue({"data":{"assignees":[{}], entryCount:0, perPage: 10, currentPage: 1}});

test('Checks if buttons exist', async () => {
    await act(async () => {
        render(<MemoryRouter><CourseInformation/></MemoryRouter>);
    });
    const buttons = await screen.getAllByRole('button');
    expect(buttons.length).toBe(5);
});
test('Checks if data exists', async () => {
    await act(async () => {
        render(<MemoryRouter><CourseInformation/></MemoryRouter>);
    });

    const data = await screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i]).innerHTML.toBeDefined();
    }
});