import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InstructorProfilePage from '../../../app/frontend/src/JS/Instructor/InstructorProfilePage';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/AuthContext';

jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/AuthContext'); 

describe('InstructorProfilePage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        name: 'Billy Guy',
        ubcid: '18592831',
        benchmark: '1300',
        roles: ['Role1', 'Role2'],
        email: 'billyGuy@instructor.ubc.ca',
        phone: '778-333-2222',
        office: 'SCI 300',
        teachingAssignments: [
          { assign: 'COSC 211', link: 'abc.com' },
          { assign: 'COSC 304', link: 'def.com' }
        ]
      }
    });

    useAuth.mockReturnValue({
      authToken: { token: 'mocked-token' } 
    });
  });

  test('Check if context shows correctly', async () => {
    render(
      <MemoryRouter><InstructorProfilePage /></MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText(/'s Profile/)).toBeInTheDocument();
    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/UBC ID:/)).toBeInTheDocument();
    expect(screen.getByText(/Service Roles:/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Hours Benchmark:/)).toBeInTheDocument();
    expect(screen.getByText(/Phone Number:/)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText(/Office Location:/)).toBeInTheDocument();
  });
});
