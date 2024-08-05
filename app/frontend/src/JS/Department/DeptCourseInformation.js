import React, { useState, useEffect, useRef, useReducer } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptCourseInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import AssignInstructorsModal from '../InsAssignInstructorsModal.js';
import { getCurrentInstructor, getTermString } from '../common/utils.js';

function CourseInformation() {
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('courseid');
  const [isEditing, setIsEditing] = useState(false);
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
  const [latestTerm, setLatestTerm] = useState(''); // State for the latest term
  const [currentInstructors, setCurrentInstructors] = useState([]);
  const [currentInstructor, setCurrentInstructor] = useState([]);
  const [numInstructors, setNumInstructors] = useState(0);
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
  const prevInstructors = useRef({});
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const fetchData = async () => {
    if (!authToken) {
      navigate('/Login');
      return;
    }
    const numericAccountType = Number(accountLogInType);
    if (numericAccountType !== 1 && numericAccountType !== 2) {
      alert('No Access, Redirecting to instructor view');
      navigate('/Dashboard');
    }
    try {
      const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
        params: { courseId: courseId },
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      const data = res.data;
      const termResponse = await axios.get("http://localhost:3001/api/terms");
      data.latestTerm = termResponse.data.currentTerm.toString();

      if (data.history.length !== 0){
        const filledEntries = fillEmptyEntries(data.history, data.perPage);
        setCourseData({ ...data, history: filledEntries });
        setCurrentInstructor(data.history.filter((entry)=>entry.term_num == data.latestTerm));
      } else {
        setCourseData(data);
      }
      
      setEditDescription(data.courseDescription);
      const currentTerm = getCurrentTerm();
      if (parseInt(currentTerm) > termResponse.data.currentTerm) {
        setPastState(true);
      } else if (parseInt(currentTerm) < termResponse.data.currentTerm) {
        setFutureState(true);
      }
      
      setTermString(getTermString(termResponse.data.currentTerm));
      // Fetch latest term
      const termRes = await axios.get(`http://localhost:3001/api/latestCourseTerm`, {
        params: { courseId: courseId },
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      setLatestTerm(termRes.data.latestTerm); // Set latest term
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken, accountLogInType, navigate, courseId]);
console.log(pastState);
  const fillEmptyEntries = (history, perPage) => {
    const filledEntries = [...history];
    const currentCount = history.length;
    const fillCount = perPage - (currentCount % perPage);
    if (fillCount < perPage) {
      for (let i = 0; i < fillCount; i++) {
        filledEntries.push({});
      }
    }
    return filledEntries;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    const updatedCourseData = { courseId, courseDescription: editDescription };
    try {
      const res = await axios.post('http://localhost:3001/api/updateCourseInfo', updatedCourseData, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      console.log('Update successful', res.data);
      window.location.reload(); // Refresh the page after successful save
    } catch (error) {
      console.error('Error updating course info', error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEditDescription(value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handlePageClick = (data) => {
    setCourseData((prevState) => ({
      ...prevState,
      currentPage: data.selected + 1,
    }));
  };

  const getCurrentTerm = () => {
    const now = new Date();
    let year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    let term;

    if (month >= 9 && month <= 12) { // Sep-Dec Winter Term 1 -> T1
      term = `${year}1`; } 
    else if (month >=1 && month <= 4){//Jan-Apr Winter Term 2 -> T2
      year -= 1;
      term = `${year}2`; }
    else if (month >=5 && month <= 6){// May-Jun Summer Term 1 -> T3
      year -= 1;
      term = `${year}3`; }
    else if (month >=7 && month <= 8){// Jul-Aug Summer Term 2 -> T4
      year -= 1;
      term = `${year}4`; }
    return term;
  };

  const handleShowInstructorModal = async () => {
    prevInstructors.current = JSON.stringify(instructorData);
    setShowInstructorModal(true);

    try {
      const res = await axios.get('http://localhost:3001/api/instructors', {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      const professors = res.data.instructors;
      console.log("received:\n", professors);
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
  };

  const handleCloseInstructorModal = (save) => {
    if (!save) {
      if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
        setInstructorData(JSON.parse(prevInstructors.current));
      } else {
        return;
      }
    } else {
      courseData.assignees = [];
      console.log(courseData);
      for (let i = 0; i < instructorData.instructors.length; i++) {
        if (instructorData.instructors[i].assigned) {
          courseData.assignees.push({
            instructorID: instructorData.instructors[i].id,
            name: instructorData.instructors[i].name,
          });
        }
      }
      updateAssignees();
    }
    setShowInstructorModal(false);
  };

  const updateAssignees = async () => {
    let assignedInstructors = [];
    for (let i = 0; i < instructorData.instructors.length; i++) {
      if (instructorData.instructors[i].assigned === true) {
        assignedInstructors.push(instructorData.instructors[i]);
        console.log(instructorData.instructors[i]);
      }
    }

    // Submitting new data goes here:
    console.log("Assigned profs are:\n", assignedInstructors, "\nAnd the assigned course ID is ", courseId);

    const term = courseData.latestTerm; // Get the formatted term
    
    for (let i = 0; i < assignedInstructors.length; i++) {
      var newAssigneeList = {
        profileId: assignedInstructors[i].profileId,
        courseId: courseId,
        term: term
      };
      try {
        console.log("Assigning prof ", i, " in list, UBCid ", newAssigneeList.profileId);
        const res = await axios.post('http://localhost:3001/api/assignInstructorCourse', newAssigneeList, {
          headers: { Authorization: `Bearer ${authToken.token}` },
        });
        console.log('Assignee update successful', res.data);
        // Re-fetch data after successful assignment
        currentInstructor.push(assignedInstructors);
        fetchData();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          window.alert('Create course for this term first');
        } else {
          console.error('Error updating assignees', error);
        }
      }
    }
  };

  const removeInstructor = async (id, index) => {
    console.log('Target instructor:',id,'\nCourseId: ',courseId,'\nTerm: ',getCurrentTerm());
    currentInstructor.splice(index, 1);
    for (let i = 0; i < instructorData.instructors.length; i++) {
      if (id === instructorData.instructors[i].id) {
        instructorData.instructors[i].assigned = false;
        break;
      }
    }
    forceUpdate();

    // Backend for removing the instructor goes here:
    try {
      const res = await axios.post('http://localhost:3001/api/removeInstructorCourse', 
        { profileId: id, courseId: courseId, term: latestTerm }, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      console.log('Instructor removal successful', res.data);
    } catch (error) {
      console.error('Error removing instructor:', error);
    }
  }

  const pageCount = Math.ceil(courseData.entryCount / courseData.perPage);
  const offset = (courseData.currentPage - 1) * courseData.perPage;

  const currentEntries = courseData.history.filter((entry)=>entry.term_num !== courseData.latestTerm).slice(
    (courseData.currentPage - 1) * courseData.perPage,
    courseData.currentPage * courseData.perPage
  );
 

console.log(courseData.tainfo);
  return (
    <div className="dashboard coursehistory">
      <CreateSideBar sideBarType="Department" />
      <div className="container">
        <CreateTopBar />
        <div className="courseinfo-main">
          <button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
          <h1 className="courseName" role="contentinfo">
            {courseData.courseCode}: {courseData.courseName}
          </h1>
          <div className="description" style={{ whiteSpace: isEditing ? 'pre-wrap' : '' }}>
            {isEditing ? (
              <textarea
                name="courseDescription"
                value={editDescription}
                onChange={handleChange}
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
                    <button type="button" className='remove-instructor' onClick={(e) => { removeInstructor(instructor.instructorID, index) }}>X</button>
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
              <button role="button" onClick={handleSaveClick}>
                Save
              </button>
            ) : (
              <>
                <button id="edit" role="button" onClick={handleEditClick}>
                  Edit Course
                </button>
                {!pastState && (
                  <button
                  type="button"
                  data-testid="assign-button"
                  className="assign-button"
                  onClick={handleShowInstructorModal}
                >
                  <span className="plus">+</span> Assign Instructor(s)
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
                      onPageChange={handlePageClick}
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
