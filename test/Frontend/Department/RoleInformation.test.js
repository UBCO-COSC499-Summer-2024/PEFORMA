import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoleInformation from '../../../app/frontend/src/JS/Department/RoleInformation';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';

jest.mock('axios');

axios.get.mockResolvedValue(':)');
axios.post.mockResolvedValue(":(");

test('Checks if buttons exist', async () => {
    render(<MemoryRouter><RoleInformation/></MemoryRouter>);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
});
test('Checks if data exists', async () => {
    render(<MemoryRouter><RoleInformation/></MemoryRouter>);
    const data = screen.getAllByRole("contentinfo");
    for (let i = 0; i < data.length; i++) {
        expect(data[i]).toBeDefined();
    }
});