import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { checkAccess, fetchWithAuth, downloadCSV } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptSEIPage.css';
import ImportModal from './DataImportImports/DeptImportModal.js';
import { FaFileImport } from 'react-icons/fa';

// export meeting to csv file
function exportToCSV(selectedMeeting, selectedParticipants) {
  const headers = "Date,Time,Location,Title,Participants,Missing\n";
  const { label, participants } = selectedMeeting;
  const [date, time, location, title] = label.split(' | ');
  const filteredTitle = title.replace(/,/g, ''); // remove comma from title to prevent from error
  const participantLabels = selectedParticipants.map(p => p.label).join(', ');
  const missingParticipants = participants
    .filter(p => !selectedParticipants.find(sp => sp.value === p.value));
  const missingLabels = missingParticipants
    .map(p => p.label)
    .join(', ');
  const csvContent = headers + `${date},${time},${location},"${filteredTitle}","${participantLabels}","${missingLabels}"\n`;

  downloadCSV(csvContent, `${date} ${title}.csv`); //download csv
}

// handle meeting selection
function handleMeetingSelect(selectedOption, setSelectedMeeting, setSelectedParticipants) {
  setSelectedMeeting(selectedOption);
  setSelectedParticipants([]);
};

// handle participant selection
function handleParticipantsChange(selectedOptions, setSelectedParticipants) {
  setSelectedParticipants(selectedOptions || []);
};

// handle cancel 
function handleCancel(setSelectedMeeting) {
  setSelectedMeeting(null);
};

// custom hook for updating current date and time to display on form
function useCurrentDateTime(setCurrentDateTime) {
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    };

    const timerId = setInterval(updateDateTime, 1000);

    return () => clearInterval(timerId);
  }, [setCurrentDateTime]);
};

// custom hook for managing department meeting state and fetch the data
function useDeptMeetingManagement() {
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();
  const [meetingData, setMeetingData] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // update date and time
  useCurrentDateTime(setCurrentDateTime);

  useEffect(() => {
    // fetch meeting data
    const fetchMeetings = async () => {
      checkAccess(accountLogInType, navigate, 'department', authToken); // check access with logintype and authToken
      try {
        const data = await fetchWithAuth('http://localhost:3001/meetings', authToken, navigate);
  
        const today = new Date(); // get todays date
        const threeDaysAgo = new Date(); // get 3 days agos date
        threeDaysAgo.setDate(today.getDate() - 3); // set date to 3 days ago
  
        const formattedData = data.meetings
          .filter(meeting => {
            const meetingDate = new Date(meeting.date);
            return meetingDate >= threeDaysAgo; // filter to show the past meetings until 3 days ago
          })
          .map(meeting => ({
            value: meeting.id,
            label: `${meeting.date} | ${meeting.time} | ${meeting.location} | ${meeting.meetingTitle}`,
            participants: meeting.participants.map(p => ({ value: p.ubcid, label: p.name }))
          }));
  
        setMeetingData(formattedData);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };
  
    fetchMeetings();
  }, [authToken, accountLogInType, navigate]);
  
  return {
    meetingData,
    selectedMeeting,
    setSelectedMeeting,
    selectedParticipants,
    setSelectedParticipants,
    currentDateTime,
  }
}

// main component and render meeting data
function DeptMeetingManagement() {
  const {
    meetingData,
    selectedMeeting,
    setSelectedMeeting,
    selectedParticipants,
    setSelectedParticipants,
    currentDateTime
  } = useDeptMeetingManagement();

  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="dashboard">
      <SideBar sideBarType="Department" />
      <div className='container'>
        <TopBar />
        <div className='SEI-form' id='meeting-test-content'>
          <div className="form-header">
            <h1 className='meeting-form-title'>Meeting Management</h1>
            <button 
              className="import-button" 
              onClick={() => setShowImportModal(true)}
              aria-label="Import data"
            >
              <FaFileImport className='import-icon'/>Import
            </button>
          </div>
          <form>
            <p className="current-date-time">Current Time: {currentDateTime}</p>
            <label>
              Select Meeting:
              <Select
                name="meeting"
                options={meetingData}
                value={selectedMeeting}
                onChange={(selectedOption) => handleMeetingSelect(selectedOption, setSelectedMeeting, setSelectedParticipants)}
                isClearable
                placeholder="Select Meeting"
              />
            </label>
            {selectedMeeting && (
              <>
                <label>
                  Select Participants: ({selectedParticipants.length}/{selectedMeeting.participants.length} Attending)
                  <Select
                    isMulti
                    name="participants"
                    options={selectedMeeting.participants}
                    value={selectedParticipants}
                    onChange={(selectedOptions) => handleParticipantsChange(selectedOptions, setSelectedParticipants)}
                    placeholder="Select participants"
                  />
                </label>
                <div className="submit-button-align">
                  <button type="submit" onClick={() => exportToCSV(selectedMeeting, selectedParticipants)}>Export</button>
                  <button type="button" className="cancel-button" onClick={() => handleCancel(setSelectedMeeting)}>Cancel</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
}

export default DeptMeetingManagement;