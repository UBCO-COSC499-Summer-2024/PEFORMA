import {render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../../../app/frontend/src/JS/All/Login';
import {MemoryRouter} from "react-router-dom";
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';
import axios from 'axios';

jest.mock('../../../app/frontend/src/JS/common/AuthContext');
jest.mock('axios');

  
useAuth.mockReturnValue({
    login:()=>{return 0}
});
  

function mockData() {
    axios.post.mockResolvedValue({
        data:{success:true, token:"token", expiresIn:"idk", email:"john.doe@ubc.ca", accountId:1, profileId:1}
    });
    axios.get.mockResolvedValue({
        data:{success:true, accountTypes:[1]}
    });
}

beforeEach(async()=>{
    global.alert=jest.fn();
    mockData();
});

test('Check user input', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Login/></MemoryRouter>);
    const emailBox = screen.getByPlaceholderText('Email Address');
    await user.type(emailBox, "Hello!");
    expect(emailBox.value).toBe("Hello!");
});

test('Check login button exists', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Login/></MemoryRouter>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument()
});

test('Check login success', async () => {
    console.log = jest.fn();
 
  const logspy = jest.spyOn(global.console, 'log');

  console.log(logspy);
    const user = userEvent.setup();
    await act(async () => {
       render(<MemoryRouter><Login/></MemoryRouter>); 
    });
    const emailBox = screen.getByPlaceholderText('Email Address');
    const passwordBox = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button");
    await user.type(emailBox, "john.doe@ubc.ca");
    await user.type(passwordBox, "123");
    await user.click(loginButton);
    expect(console.log).toBeCalledWith(`Log in as account type: 1`)

});