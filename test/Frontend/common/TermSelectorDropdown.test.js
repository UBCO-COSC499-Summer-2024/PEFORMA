import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TopBar from '../../../app/frontend/src/JS/common/TopBar';

// Mock the utility functions to control their behavior in tests
jest.mock('../../../app/frontend/src/JS/common/utils', () => ({
    ...jest.requireActual('../../../app/frontend/src/JS/common/utils'),
    fetchWithAuth: jest.fn(),
    postWithAuth: jest.fn(),
}));

import { fetchWithAuth, postWithAuth } from '../../../app/frontend/src/JS/common/utils';

// Mock the navigation function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock the authentication context
const mockUseAuth = {
    authToken: { token: 'mocked-token' },
    accountType: [1],
    accountLogInType: 1,
    profileId: 'mocked-profileId',
    setAccountLogInType: jest.fn(),
};

jest.mock('../../../app/frontend/src/JS/common/AuthContext', () => ({
    ...jest.requireActual('../../../app/frontend/src/JS/common/AuthContext'),
    useAuth: () => mockUseAuth,
}));

describe('Term Selector Dropdown Component', () => {
    let mockOnTermChange;

    beforeEach(() => {
        jest.clearAllMocks();
        mockOnTermChange = jest.fn();
    });

    // Helper function to render the TopBar component
    const renderTopBar = (accountType = 1) => {
        mockUseAuth.accountLogInType = accountType;
        return render(
            <MemoryRouter>
                <TopBar onTermChange={mockOnTermChange} />
            </MemoryRouter>
        );
    };

    test('renders term selector dropdown when accountType is 1', async () => {
        // Mock the API responses
        fetchWithAuth.mockResolvedValueOnce({
            firstName: 'John',
            lastName: 'Doe'
        });
        fetchWithAuth.mockResolvedValueOnce({
            terms: [20241, 20242, 20243, 20244],
            currentTerm: 20241
        });

        renderTopBar(1);

        // Wait for the initial term to be displayed
        await waitFor(() => {
            expect(screen.getByText('2024 Winter Term 1')).toBeInTheDocument();
        });

        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeInTheDocument();

        // Open the dropdown
        userEvent.click(selectElement);

        // Check if all term options are displayed
        await waitFor(() => {
            expect(screen.getByText('2024 Winter Term 2')).toBeInTheDocument();
            expect(screen.getByText('2024 Summer Term 1')).toBeInTheDocument();
            expect(screen.getByText('2024 Summer Term 2')).toBeInTheDocument();
        });
    });

    test('does not render term selector dropdown when accountType is 2', async () => {
        renderTopBar(2);

        await waitFor(() => {
            expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        });
    });

    test('does not render term selector dropdown when accountType is 3', async () => {
        renderTopBar(3);

        await waitFor(() => {
            expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        });
    });

    test('does not render term selector dropdown when accountType is 4', async () => {
        renderTopBar(4);

        await waitFor(() => {
            expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        });
    });

    test('changes term when a new option is selected', async () => {
        // Mock API responses
        fetchWithAuth.mockResolvedValueOnce({
            firstName: 'John',
            lastName: 'Doe'
        });
        fetchWithAuth.mockResolvedValueOnce({
            terms: [20241, 20242, 20243, 20244],
            currentTerm: 20241
        });
        postWithAuth.mockResolvedValueOnce({});

        renderTopBar(1);

        await waitFor(() => {
            expect(screen.getByText('2024 Winter Term 1')).toBeInTheDocument();
        });

        const selectElement = screen.getByRole('combobox');
        userEvent.click(selectElement);

        // Select a new term
        const newTermOption = await screen.findByText('2024 Summer Term 1');
        userEvent.click(newTermOption);

        // Check if the API was called to update the term
        await waitFor(() => {
            expect(postWithAuth).toHaveBeenCalledWith(
                'http://localhost:3001/api/setCurrentTerm',
                expect.anything(),
                expect.anything(),
                { term: '20243' }
            );
            // Check if the onTermChange callback was called
            expect(mockOnTermChange).toHaveBeenCalledWith('20243');
        });
    });

    test('calls onTermChange when a new term is selected', async () => {
        // Mock API responses
        fetchWithAuth.mockResolvedValueOnce({
            firstName: 'John',
            lastName: 'Doe'
        });
        fetchWithAuth.mockResolvedValueOnce({
            terms: [20241, 20242, 20243, 20244],
            currentTerm: 20241
        });
        postWithAuth.mockResolvedValueOnce({});

        renderTopBar(1);

        await waitFor(() => {
            expect(screen.getByText('2024 Winter Term 1')).toBeInTheDocument();
        });

        const selectElement = screen.getByRole('combobox');
        userEvent.click(selectElement);

         // Select a new term
        const newTermOption = await screen.findByText('2024 Summer Term 1');
        userEvent.click(newTermOption);

        await waitFor(() => {
            // Check if the API was called to update the term
            expect(postWithAuth).toHaveBeenCalledWith(
                'http://localhost:3001/api/setCurrentTerm',
                expect.anything(),
                expect.anything(),
                { term: '20243' }
            );
            // Check if the onTermChange callback was called
            expect(mockOnTermChange).toHaveBeenCalledWith('20243');
        });
    });

    // Note: We don't test directly if DeptPerformancePage receives the new term,
    // as this happens through the state update in the parent component (PerformanceDepartmentPage)
});