import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../src/JS/All/HomePage';
import {MemoryRouter} from "react-router-dom";

test('Ensure that homepage renders', async () => {
    render(<MemoryRouter><HomePage/></MemoryRouter>);
    const login = screen.getByText('Login');
    expect(login).toBeInTheDocument();
});
