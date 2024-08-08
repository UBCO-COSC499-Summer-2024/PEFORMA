import React, { useState, useEffect } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Instructor/InsCourseHistory.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { checkAccess, fillEmptyItems, handlePageClick, currentItems, getTermString } from '../common/utils.js';

// Function for requesting the course information from the backend
const fetchCourseData = async(courseId, authToken) => {
	const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
		params: { courseId: courseId },
		headers: { Authorization: `Bearer ${authToken.token}` },
	});
	return res.data;
}

// Function for requesting the currently active term from the backend
const fetchTermResponse = async() => {
	const termResponse = await axios.get("http://localhost:3001/api/terms");
	return termResponse.data;
  }
  
function useCourseHistory() {
	const navigate = useNavigate(); // For navigating to different pages
	const { authToken, accountLogInType } = useAuth();
	// Get the courseid from the URL
	const params = new URLSearchParams(window.location.search);
	const courseId = params.get('courseid');
	// State variables
	const [historyData, setHistoryData] = useState({
		history: [{}],
		entryCount: 0,
		perPage: 10,
		currentPage: 1,
		tainfo:[{}]
	});
	const [termString, setTermString] = useState('');
	const [currentInstructor, setCurrentInstructor] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			checkAccess(accountLogInType, navigate, 'instructor', authToken);
			const courseData = await fetchCourseData(courseId, authToken);
			// courseData contains: {currentPage, perPage, courseID, entryCount, exists, courseCode, latestTerm, courseName, courseDescription, division, avgScore, history, tainfo}
			// history contains an array of: {instructorID, instructorName, session, term, score, term_num (year then term), ubcid, location, enrollment, meetingPattern}
      			// tainfo contains an array of: {taname, taemail, taUBCId, taterm}
			const filledEntries = fillEmptyItems(courseData.history, courseData.perPage);
			// Get currently active term
			const termData = await fetchTermResponse();
			// Set the latestTerm attribute in courseData to be the currently active term
			courseData.latestTerm = termData.currentTerm.toString();
			// Set the name of the term to be displayed to the user
			setTermString(getTermString(termData.currentTerm));
			// Set the history table to only show instructors from previous terms
			setHistoryData({ ...courseData, history: filledEntries.filter((entry)=>entry.term_num < courseData.latestTerm) });
			// Set the current instructors section to only show instructors with assignments matching the current term
			setCurrentInstructor(courseData.history.filter((entry)=>entry.term_num == courseData.latestTerm));
		};
		fetchData();
	}, []);
	return {
		historyData, setHistoryData,
		navigate,
		currentInstructor,
		termString, setTermString
	}
}

function CourseHistory() {
	// Get state variables
	const {
		historyData, setHistoryData,
		navigate,
		currentInstructor,
		termString, setTermString
	} = useCourseHistory();
	
	const pageCount = Math.ceil(historyData.entryCount / historyData.perPage);
	const currentEntries = currentItems(historyData.history, historyData.currentPage, historyData.perPage);
	return (
		<div className="dashboard coursehistory">
			<SideBar sideBarType="Instructor"/>
			<div className="container">
				<TopBar />
				<div className="courseinfo-main" data-testid="courseinfo-main">
				<button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
					<h1 className="courseName" role="contentinfo">
						{historyData.courseCode}: {historyData.courseName}
					</h1>
					<p role="contentinfo">{historyData.courseDescription}</p>
					<div className="current-instructor">
						<p>Current Instructor(s) ({termString}): {currentInstructor.length === 0 && (
							<strong>N/A</strong>
						)}
						{currentInstructor.length !== 0 && (
							currentInstructor.map((instructor, index) => {
								return (
								<span>
								<Link to={"/InsProfilePage?profileid="+instructor.instructorID}><strong>{instructor.instructorName}</strong></Link>
								{index !== currentInstructor.length - 1 && (
									<span>, </span>
								)}
								</span>
								);
								
							})
						)}
							</p>
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
					<p>Current TA(s) ({termString}):
						{historyData.tainfo.length === 0 && (
							<strong> N/A</strong>
						)}
					</p>
					{historyData.tainfo.length !== 0 && (
					historyData.tainfo.map((ta, index) => {
						return (
						<div key={index}>
							- <span><strong>{ta.taname}</strong>, {ta.taemail}</span>
						</div>
						);
					})
            		)}
					<div id="history">
						<p className="bold">Course History</p>
						<table id="historyTable">
							<thead>
								<tr>
									<th>Instructor</th>
									<th>Session</th>
									<th>Term</th>
								</tr>
							</thead>
							<tbody>
							{(currentEntries.length === 0 || currentEntries[0].instructorID === "") && (
                  				<tr><td colSpan={4}>There are no past instructors for this course.</td></tr>
                			)}
								{currentEntries.map((entry, index) => {
									return (
										<tr key={index}>
											<td>
												<Link to={`/InsProfilePage?profileid=${entry.instructorID}`}>
													{entry.instructorName}
												</Link>
											</td>
											<td>{entry.session}</td>
											<td>{entry.term}</td>
										</tr>
									);
								})}
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
											onPageChange={(data)=>handlePageClick(data, setHistoryData)}
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

export default CourseHistory;
