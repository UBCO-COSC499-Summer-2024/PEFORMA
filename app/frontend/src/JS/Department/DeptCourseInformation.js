import React, { useState, useEffect, useRef, useReducer } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptCourseInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import AssignInstructorsModal from '../InsAssignInstructorsModal.js';
import { getTermString, checkAccess, fillEmptyItems, getCurrentTerm, currentItems, handlePageClick } from '../common/utils.js';

// Function for recieving course information and history related data
const fetchCourseHistory = async(courseId, authToken) => {
  const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
    params: { courseId: courseId },
    headers: { Authorization: `Bearer ${authToken.token}` },
  });
  return res.data;
}

// Function for recieving the currently active term
const fetchTermResponse = async() => {
  const termResponse = await axios.get("http://localhost:3001/api/terms");
  return termResponse.data;
}

// Function for filtering the Course History data so it can be properly displayed in the table
function filterCourseData(courseHistoryData, setCourseData, setCurrentInstructor) {
  // If there instructor data exists, set current instructors and past instructors
  if (courseHistoryData.history.length !== 0) {
    const filledEntries = fillEmptyItems(courseHistoryData.history, courseHistoryData.perPage);
    // Set history table to only show instructors assigned from a term before the current term
    setCourseData({ ...courseHistoryData, history: filledEntries.filter((entry)=>entry.term_num < courseHistoryData.latestTerm) });
    // Set the current instructor list to any instructors assigned to this course in the currently active term
    setCurrentInstructor(courseHistoryData.history.filter((entry)=>entry.term_num == courseHistoryData.latestTerm));
  } else {
    setCourseData(courseHistoryData);
  }
  return;
}

// Function for setting the time state of the page, i.e. if it's term is before the currently active term, set pastState to true,
// if it's after the currently active term, set futureState to true. If it's the same term, both remain false.
function setTimeState(actualTerm, selectedTerm, setPastState, setFutureState) {
  if (parseInt(actualTerm) > selectedTerm) {
    setPastState(true);
  } else if (parseInt(actualTerm) < selectedTerm) {
    setFutureState(true);
  }
}

function useCourseInformation() {
  // Authentication variables for various backend requests
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate(); // For navigating to a different page
  // Get courseId from the URL
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('courseid');
  // State variables
  const [isEditing, setIsEditing] = useState(false);
  const [active, setActive] = useState(true);
  const [editDescription, setEditDescription] = useState('');
  const [courseData, setCourseData] = useState({
    history: [{}],
    entryCount: 0,
    perPage: 10,
    currentPage: 1,
    courseCode: '',
    courseName: '',
    courseDescription: '',
    avgScore: '',
    currentInstructor: 'Willem Dafoe',
    tainfo:[{}]
  });
  const [currentInstructor, setCurrentInstructor] = useState([]);
  const [pastState, setPastState] = useState(false);
  const [futureState, setFutureState] = useState(false);
  const [termString, setTermString] = useState('');
  const [instructorData, setInstructorData] = useState({
    instructors: [{}],
    instructorCount: 0,
    perPage: 8,
    currentPage: 1,
  });
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const prevInstructors = useRef({}); // Variable for storing original instructor assignments if the user decides to click cancel on the modal
  const [, reactUpdate] = useReducer(i => i + 1, 0); // Function for forcing the page to update

  // Upon entering the page, get necessary data
  const fetchData = async () => {
    checkAccess(accountLogInType, navigate, 'department', authToken);
    try {
      // Get course data
      const courseHistoryData = await fetchCourseHistory(courseId, authToken);
      // courseHistoryData contains: {currentPage, perPage, courseID, entryCount, exists, courseCode, latestTerm, courseName, courseDescription, division, avgScore, history, tainfo}
      // history contains an array of: {instructorID, instructorName, session, term, score, term_num (year then term), ubcid, location, enrollment, meetingPattern}
      // tainfo contains an array of: {taname, taemail, taUBCId, taterm}

      // Get currently active term
      const termData = await fetchTermResponse();
      // Set the latestTerm attribute to the active term
      courseHistoryData.latestTerm = termData.currentTerm.toString();
      filterCourseData(courseHistoryData, setCourseData, setCurrentInstructor);
      // Set the placeholder value of the description edit box to the current description
      setEditDescription(courseHistoryData.courseDescription);
      const currentTerm = getCurrentTerm();
      setTimeState(currentTerm, termData.currentTerm, setPastState, setFutureState);
      // Set the name of the term to be displayed to the user
      setTermString(getTermString(termData.currentTerm));
      // Set active state to false if course is inactive
      if (!courseHistoryData.exists) {
        setActive(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [authToken, accountLogInType, navigate, courseId]);

  return {
    isEditing, setIsEditing,
    editDescription, setEditDescription,
    courseData, setCourseData,
    currentInstructor, setCurrentInstructor,
    pastState, setPastState,
    futureState, setFutureState,
    termString, setTermString,
    instructorData, setInstructorData,
    showInstructorModal, setShowInstructorModal,
    prevInstructors,
    reactUpdate,
    authToken,
    courseId,
    navigate,
    fetchData,
    active
  }
}

// Function to be called after clicking the edit button
const handleEditClick = (setIsEditing) => {
  // Set edit state to true
  setIsEditing(true);
};

// Function for updating the description of the course
const updateCourseData = async(courseId, editDescription, authToken, courseData, reactUpdate) => {
  const updatedCourseData = { courseId, courseDescription: editDescription };
  // Send new description to backend to be updated
  try {
    await axios.post('http://localhost:3001/api/updateCourseInfo', updatedCourseData, {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
    // Once complete, set the current description to the newly changed one
    courseData.courseDescription = editDescription;
    // Force the page to update
    reactUpdate();
  } catch (error) {
    console.error('Error updating course info', error);
  }
}

// Function to be called after clicking the Save button
const handleSaveClick = async (setIsEditing, courseId, editDescription, authToken, courseData, reactUpdate) => {
  // Set edit state to false
  setIsEditing(false);
  // Update course information
  await updateCourseData(courseId, editDescription, authToken, courseData, reactUpdate);
};

// Function to be called after editing the description
const handleChange = (e, setEditDescription) => {
  // Set current editDescription value to newly entered description
  const { value } = e.target;
  setEditDescription(value);
  // Format the edit description area 
  e.target.style.height = 'auto';
  e.target.style.height = e.target.scrollHeight + 'px';
};

// function for getting all instructors upon clicking the assign button
const fetchInstructors = async(authToken, setInstructorData) => {
  // Request all instructors
  try {
    const res = await axios.get('http://localhost:3001/api/instructors', {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
    // res.data contains: {instructors, instructorCount, perPage, currentPage}
    const professors = res.data.instructors;
    // Handle different possible backend responses
    if (Array.isArray(professors)) {
      setInstructorData((prevData) => ({
        ...prevData,
        instructors: professors,
        instructorCount: professors.length,
      }));
    } else {
      setInstructorData((prevData) => ({
        ...prevData,
        instructors: [],
        instructorCount: 0,
      }));
      console.error('Expected an array but got:', professors);
    }
  } catch (error) {
    console.error('Error fetching professors:', error);
    setInstructorData((prevData) => ({
      ...prevData,
      instructors: [],
      instructorCount: 0,
    }));
  }
}

// Function to be called upon clicking the assign instructors button
const handleShowInstructorModal = async (prevInstructors, authToken, setInstructorData, instructorData, setShowInstructorModal) => {
  // Save currently assigned instructors in the case of the user cancelling
  prevInstructors.current = JSON.stringify(instructorData);
  // Show modal
  setShowInstructorModal(true);
  await fetchInstructors(authToken, setInstructorData);
};

// Function to be called upon clicking the cancel or save button on the modal
// The parameters are formatted as [] so it can be used easily by the InsAssignInstructorsModal file
const handleCloseInstructorModal = (save, [instructorData, setInstructorData, courseData, setShowInstructorModal, prevInstructors, authToken, currentInstructor, courseId, fetchData]) => {
  // If cancel button was clicked, show a confirmation message
  if (!save) {
    if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
      // If yes, set currently assigned instructors back to the previously assigned ones
      setInstructorData(JSON.parse(prevInstructors.current));
    } else {
      // If no, return back to modal
      return;
    }
  } else {
    // If save was clicked, call the updateAssignees function
    updateAssignees(instructorData, courseData, authToken, currentInstructor, courseId, fetchData);
  }
  // Close modal
  setShowInstructorModal(false);
};

// function for finding all assigned instructors
function getAssignedInstructors(instructorData, courseData) {
  let assignedInstructors = [];
  courseData.assignees = [];
  // For every instructor, check if assigned is true. If it is, add that instructor to the assignedInstructors array and the courseData.assignees array
  for (let i = 0; i < instructorData.instructors.length; i++) {
    if (instructorData.instructors[i].assigned === true) {
      assignedInstructors.push(instructorData.instructors[i]);
      courseData.assignees.push({
        instructorID: instructorData.instructors[i].id,
        name: instructorData.instructors[i].name,
      });
    }
  }
  return assignedInstructors;
}

// Function for sending the newly assigned instructors to the backend to be saved in the database
const sendAssignees = async(assignedInstructors, courseData, authToken, currentInstructor, courseId, fetchData) => {
  const term = courseData.latestTerm; // Get latest term
  // For every newly assigned Instructor, send them to the backend to be saved
  for (let i = 0; i < assignedInstructors.length; i++) {
    var newAssigneeList = {
      profileId: assignedInstructors[i].profileId,
      courseId: courseId,
      term: term
    };
    try {
      await axios.post('http://localhost:3001/api/assignInstructorCourse', newAssigneeList, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      // Re-fetch data after successful assignment
      currentInstructor.push(assignedInstructors);
      console.log("Refetching data..."); // This console log is neccesary for the test
      fetchData();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        window.alert('Create course for this term first');
      } else {
        console.error('Error updating assignees', error);
      }
    }
  }
}

// Helper function to be called during the assigning process. It gets all currently assigned instructors then sends them to the backend
const updateAssignees = async (instructorData, courseData, authToken, currentInstructor, courseId, fetchData) => {
  let assignedInstructors = getAssignedInstructors(instructorData, courseData);
  await sendAssignees(assignedInstructors, courseData, authToken, currentInstructor, courseId, fetchData);
};

// Function to be called when clicking the "x" next to an assigned instructor to remove them
function removeInstructorFromCourseData(index, id, instructorData, currentInstructor, reactUpdate) {
  currentInstructor.splice(index, 1); // Remove the instructor at the index that the user clicked
  // For every instructor, check if their id matches the one that was removed, if it matches, set the assigned value of that instructor to false
  for (let i = 0; i < instructorData.instructors.length; i++) {
    if (id === instructorData.instructors[i].id) {
      instructorData.instructors[i].assigned = false;
      break;
    }
  }
  // Force a page update
  reactUpdate();
}

// Function for removing an instructor. Sends a request to the backend with the instructor's data that needs to be removed
const sendRemovedInstructor = async(courseId, id, authToken, courseData) => {
  try {
    await axios.post('http://localhost:3001/api/removeInstructorCourse', 
     { profileId: id, courseId: courseId, term: courseData.latestTerm }, {
     headers: { Authorization: `Bearer ${authToken.token}` },
   });
 } catch (error) {
   console.error('Error removing instructor:', error);
 }
}

// Helper function for removing an instructor
const removeInstructor = async (id, index, courseId, currentInstructor, reactUpdate, courseData, instructorData, authToken) => {
  removeInstructorFromCourseData(index, id, instructorData, currentInstructor, reactUpdate);
  await sendRemovedInstructor(courseId, id, courseData, authToken, courseData);
}

function CourseInformation() {
  // Get all necessary variables
  const {
    isEditing, setIsEditing,
    editDescription, setEditDescription,
    courseData, setCourseData,
    currentInstructor, setCurrentInstructor,
    pastState, setPastState,
    futureState, setFutureState,
    termString, setTermString,
    instructorData, setInstructorData,
    showInstructorModal, setShowInstructorModal,
    prevInstructors,
    reactUpdate,
    authToken,
    courseId,
    navigate,
    fetchData,
    active
  } = useCourseInformation();

  const pageCount = Math.ceil(courseData.entryCount / courseData.perPage);
  // closeModalVars are for the InsAssignInstructorsModal to know what variables to use when calling handleCloseInstructorModal
  const closeModalVars = [instructorData, setInstructorData, courseData, setShowInstructorModal, prevInstructors, authToken, currentInstructor, courseId, fetchData];
  const currentEntries = currentItems(courseData.history, courseData.currentPage, courseData.perPage);

  return (
    <div className="dashboard coursehistory">
      <SideBar sideBarType="Department" />
      <div className="container">
        <TopBar />
        <div className="courseinfo-main" data-testid="courseinfo-main">
          <button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
          <h1 className="courseName" role="contentinfo">
            {courseData.courseCode}: {courseData.courseName}
          </h1>
          <div className="description" style={{ whiteSpace: isEditing ? 'pre-wrap' : '' }}>
            {isEditing ? (
              <textarea
                name="courseDescription"
                data-testid="courseDescription"
                value={editDescription}
                onChange={(e)=>handleChange(e, setEditDescription)}
                className="editable-textarea"
                style={{ minHeight: '80px', height: 'auto', overflow: 'hidden' }}
              />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{courseData.courseDescription}</p>
            )}
          </div>
          <div className="bold score">
            Average Performance Score: <span role="contentinfo">{courseData.avgScore}</span>
          </div>
          <div className="current-term">
          </div>
          <div className="current-instructor">
            <p>
              
              {pastState || futureState ? (
                <>Assigned Instructors for {termString}</>
              ) : (
                <>Current Instructor(s) ({termString}): </>
              )}
              {pastState && (
                <> (Archived): </>
              )}
              {futureState && (
                <> (Future): </>
              )}
               {currentInstructor.length === 0 && (
              <strong>N/A</strong>
            )}
            </p>
            {currentInstructor.length !== 0 && (
              currentInstructor.map((instructor, index) => {
                return (
                  <div key={instructor.instructorID}>
                    - <Link to={`/DeptProfilePage?ubcid=${instructor.ubcid}`}><strong>{instructor.instructorName}</strong></Link>
                    {!pastState && (
                    <button type="button" className='remove-instructor' onClick={(e) => { removeInstructor(instructor.instructorID, index, courseId, currentInstructor, reactUpdate, courseData, instructorData, authToken) }}>X</button>
                    )}
                  </div>
                );
              })
            )}
          {currentInstructor.length !== 0 && (
            <div className='assignmentInfo'>
            {currentInstructor[0].location !== null && (
            <p>Room: <strong>{currentInstructor[0].location}</strong></p>
            )}
            {currentInstructor[0].enrollment !== null && (
            <p>Number of Students: <strong>{currentInstructor[0].enrollment}</strong></p>
            )}
            {currentInstructor[0].meetingPattern !== null && (
            <p>Schedule: <strong>{currentInstructor[0].meetingPattern}</strong></p>
            )}
            </div>
          )}
          </div>
          <div className='current-instructor'>
            <p>
            {pastState || futureState ? (
                <>Assigned TA(s) for {termString}</>
              ) : (
                <>Current TA(s) ({termString}): </>
              )}
              {pastState && (
                <> (Archived): </>
              )}
              {futureState && (
                <> (Future): </>
              )}
               {courseData.tainfo.length === 0 && (
              <strong>N/A</strong>
              
            )}
            </p>
            {courseData.tainfo.length !== 0 && (
              courseData.tainfo.map((ta, index) => {
                return (
                  <div key={index}>
                    - <span><strong>{ta.taname}</strong>, {ta.taemail}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="buttons">
            {isEditing ? (
              <button role="button" data-testid="save" onClick={()=>handleSaveClick(setIsEditing, courseId, editDescription, authToken, courseData, reactUpdate)}>
                Save
              </button>
            ) : (
              <>
                <button id="edit" data-testid="edit" role="button" onClick={()=>handleEditClick(setIsEditing)}>
                  Edit Course
                </button>
                {(!pastState && active) && (
                  <button
                  type="button"
                  data-testid="assign-button"
                  className="assign-button"
                  onClick={()=>handleShowInstructorModal(prevInstructors, authToken, setInstructorData, instructorData, setShowInstructorModal)}
                >
                  <span className="plus">+</span> Assign Instructor(s)
                </button>
                )}
                {!active && (
                  <button className='assign-button inactive'>
                    <span>Assign Unavailable</span>
                  </button>
                )}
              </>
            )}
          </div>
          {showInstructorModal && (
            <AssignInstructorsModal
              instructorData={instructorData}
              setInstructorData={setInstructorData}
              handleCloseInstructorModal={handleCloseInstructorModal}
              closeModalVars={closeModalVars}
            />
          )}
          <div id="history">
            <p className="bold">Course History</p>
            <table id="historyTable">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Session</th>
                  <th>Term</th>
                  <th>Performance Score</th>
                </tr>
              </thead>
              <tbody>
              {(currentEntries.length === 0 || currentEntries[0].instructorID === "") && (
                  <tr><td colSpan={4}>There are no past instructors for this course.</td></tr>
                )}
                {currentEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/DeptProfilePage?ubcid=${entry.ubcid}`}>
                        {entry.instructorName}
                      </Link>
                    </td>
                    <td>{entry.session}</td>
                    <td>{entry.term}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel={'...'}
                      pageCount={pageCount}
                      marginPagesDisplayed={3}
                      pageRangeDisplayed={0}
                      onPageChange={(data)=>handlePageClick(data, setCourseData)}
                      containerClassName={'pagination'}
                      activeClassName={'active'}
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseInformation;
