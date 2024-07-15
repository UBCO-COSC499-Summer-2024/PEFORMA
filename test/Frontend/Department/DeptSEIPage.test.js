import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptSEIPage from '../../../app/frontend/src/JS/Department/DeptSEIPage';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

describe('DeptSEIPage', () => {
  let element; 

	beforeEach(() => {
    useAuth.mockReturnValue({
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId'}
    });
    render(
      <MemoryRouter>
        <DeptSEIPage />
      </MemoryRouter>
    );
    element = document.getElementById('SEI-test-content');
  });
  
});