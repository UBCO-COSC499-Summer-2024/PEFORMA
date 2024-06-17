import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../../../app/frontend/src/JS/All/Login';

test('Check user input', async () => {
    const user = userEvent.setup();
    render(<Login/>);
    const emailBox = screen.getByPlaceholderText('Email Address');
    await user.type(emailBox, "Hello!");
    expect(emailBox.value).toBe("Hello!");
});

test('Check login button exists', async () => {
    const user = userEvent.setup();
    render(<Login/>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument()
    

});