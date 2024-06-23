import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DataEntry from '../../../app/frontend/src/JS/Department/DataEntry';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';

jest.mock('axios');
axios.post.mockResolvedValue("");

test('Checks if menu works', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><DataEntry/></MemoryRouter>);
    const dropdown = screen.getByRole("button", {name: /dropdown/i});
    await user.click(dropdown);
    const dropdownNewServiceRole = screen.getByRole("button", {name: /newServiceRole/i})
    await user.click(dropdownNewServiceRole);
    const newServiceRoleForm = screen.getByRole("form", {name: /newServiceRoleForm/i});
    expect(newServiceRoleForm).toBeInTheDocument();
    
});
