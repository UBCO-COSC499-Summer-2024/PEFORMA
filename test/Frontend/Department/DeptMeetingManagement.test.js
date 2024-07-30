import { fireEvent, render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeptMeetingManagement from '../../../app/frontend/src/JS/Department/DeptMeetingManagement';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../app/frontend/src/JS/common/AuthContext';

// mock axios
jest.mock('axios');
jest.mock('../../../app/frontend/src/JS/common/AuthContext');

// mocking date to July 26, month starts from 0
const mockDate = new Date(2024, 6, 28); 
const OriginalDate = Date;

global.Date = jest.fn((...args) => {
  if (args.length) {
    return new OriginalDate(...args);
  }
  return mockDate;
});

global.Date.now = OriginalDate.now;
global.Date.parse = OriginalDate.parse;
global.Date.UTC = OriginalDate.UTC;

describe('DeptMeetingManagement', () => {
  // setup before each test
  beforeEach(async () => {
    useAuth.mockReturnValue({
      authToken: { token: 'mocked-token' },
      profileId: { profileId: 'mocked-profileId' }
    });
    axios.get.mockResolvedValue({
      data: {
        "meetings": [
          {"id": 1, "meetingTitle": "Physics, department, meeting", "location": "ASC 234", "date": "2024-07-28", "time": "09:00", "participants": [{"ubcid": 11111111, "name": "John doe"}, {"ubcid": 11111112, "name": "Doe Doe"}]},
          {"id": 2, "meetingTitle": "Math department meeting", "location": "FIP 210", "date": "2024-08-01", "time": "11:00", "participants": [{"ubcid": 11111111, "name": "John doe"}, {"ubcid": 11111113, "name": "Random doe"}, {"ubcid": 11111112, "name": "Doe Doe"}, {"ubcid": 11111111, "name": "MATH BOi"}]},
          {"id": 3, "meetingTitle": "Daily meeting", "location": "Online", "date": "2024-08-15", "time": "10:00", "participants": [{"ubcid": 11111111, "name": "John doe"}, {"ubcid": 44444433, "name": "Dong"}]},
          {"id": 4, "meetingTitle": "Computer Science course adjustment meeting", "location": "SCI 301", "date": "2024-09-21", "time": "18:00", "participants": [{"ubcid": 11111112, "name": "Doe Doe"}, {"ubcid": 12312312, "name": "leo ma"}]},
          {"id": 5, "meetingTitle": "asdasdasdasd", "location": "SCI 300001", "date": "2024-09-25", "time": "18:00", "participants": [{"ubcid": 11111112, "name": "Doe Doe"}, {"ubcid": 12312312, "name": "Leo Ma"}]}
        ]
      }
    });
    // render component
    await act(async () => {
      render(
        <MemoryRouter>
          <DeptMeetingManagement />
        </MemoryRouter>
      );
    });
  });
  // restore back to original date after tests
  afterAll(() => {
    global.Date = OriginalDate;
  });

  test('Testing rendering list of participants after selecting meeting', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    // find the react-select component for meeting
    const meetingSelect = screen.getByText('Select Meeting');
    expect(meetingSelect).toBeInTheDocument();

    // simulate clicking meeting
    await act(async () => {
      fireEvent.focus(meetingSelect);
      fireEvent.keyDown(meetingSelect, { key: 'ArrowDown' });
    });

    // select a specific meeting
    const meetingOption = await screen.findByText('2024-08-01 | 11:00 | FIP 210 | Math department meeting');
    expect(meetingOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(meetingOption);
    });

    // find a select participants 
    const participantSelect = screen.getByLabelText(/Select Participants:/i);
    expect(participantSelect).toBeInTheDocument();

    // simulate participants options
    await act(async () => {
      fireEvent.focus(participantSelect);
      fireEvent.keyDown(participantSelect, { key: 'ArrowDown' });
    });

    // check if all the participants render well as expected in mock data
    const participant1 = await screen.findByText('John doe');
    const participant2 = await screen.findByText('Random doe');
    const participant3 = await screen.findByText('Doe Doe');
    const participant4 = await screen.findByText('MATH BOi');

    expect(participant1).toBeInTheDocument();
    expect(participant2).toBeInTheDocument();
    expect(participant3).toBeInTheDocument();
    expect(participant4).toBeInTheDocument();
  });
  test('Testing selecting John Doe to be in participants list', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));

    // find the react-select component for meeting
    const meetingSelect = screen.getByText('Select Meeting');
    expect(meetingSelect).toBeInTheDocument();

    // simulate clicking course select
    await act(async () => {
      fireEvent.focus(meetingSelect);
      fireEvent.keyDown(meetingSelect, { key: 'ArrowDown' });
    });

    // select a specific meeting
    const meetingOption = await screen.findByText('2024-09-25 | 18:00 | SCI 300001 | asdasdasdasd');
    expect(meetingOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(meetingOption);
    });

    // find a select participants 
    const participantSelect = screen.getByLabelText(/Select Participants:/i);
    expect(participantSelect).toBeInTheDocument();

    // simulate participants options
    await act(async () => {
      fireEvent.focus(participantSelect);
      fireEvent.keyDown(participantSelect, { key: 'ArrowDown' });
    });

    // select a participant name Leo Ma
    const participantOption = await screen.findByText('Leo Ma');
    expect(participantOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(participantOption);
    });

    // check if Leo Ma is selected. 0/2 -> 1/2
    const selectedParticipants = screen.getByText(/1\/2 Attending/);
    expect(selectedParticipants).toBeInTheDocument();
  });
  test('Testing cancel button', async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(6));

    // find the react-select component for meeting
    const meetingSelect = screen.getByText('Select Meeting');
    expect(meetingSelect).toBeInTheDocument();

    // simulate clicking meeting select
    await act(async () => {
      fireEvent.focus(meetingSelect);
      fireEvent.keyDown(meetingSelect, { key: 'ArrowDown' });
    });

    // select a specific meeting
    const meetingOption = await screen.findByText('2024-09-25 | 18:00 | SCI 300001 | asdasdasdasd');
    expect(meetingOption).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(meetingOption);
    });

    // check if the meeting is selected
    expect(screen.getByText('2024-09-25 | 18:00 | SCI 300001 | asdasdasdasd')).toBeInTheDocument();

    // find cancel button
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    // simulate clicking the cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // check if the selected meeting has been disabled
    expect(screen.queryByText('2024-09-25 | 18:00 | SCI 300001 | asdasdasdasd')).not.toBeInTheDocument();
});

});
