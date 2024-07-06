import { act, render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DeptDataEntry from '../../../app/frontend/src/JS/Department/DeptDataEntry';
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');
useAuth.mockReturnValue({
  profileId: { profileId: 'mocked-profileId'},
  accountType: { accountType: 'mocked-accountType' },
});

axios.get.mockResolvedValue({"data":{"instructors":[{}], instructorCount:0, perPage: 8, currentPage: 1}});

test('Checks if modal exists', async () => {
    const user = userEvent.setup();
    let { getByTestId } = ""; 
    await act(async () => {
        ({getByTestId} = render(<MemoryRouter><DeptDataEntry/></MemoryRouter>)); 
    });
    const dropdown = screen.getByLabelText("Create New:");
    fireEvent.change(dropdown, {target: {value:"Service Role"}}); // Select from drop down to make form appear
    let assignButton = screen.getByTestId("assign-button");
    await user.click(assignButton);
    let modal = screen.getByTestId("assignModal");
    expect(modal).toBeInTheDocument();

});
