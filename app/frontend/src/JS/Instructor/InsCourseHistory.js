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

const fetchCourseData = async(courseId, authToken) => {
	const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
		params: { courseId: courseId },
		headers: { Authorization: `Bearer ${authToken.token}` },
	});
	return res.data;
}

const fetchTermResponse = async() => {
	const termResponse = await axios.get("http://localhost:3001/api/terms");
	return termResponse.data;
  }
  

function useCourseHistory() {
	const [historyData, setHistoryData] = useState({
		history: [{}],
		entryCount: 0,
		perPage: 10,
		currentPage: 1,
		tainfo:[{}]
	});
	const navigate = useNavigate();
	const [termString, setTermString] = useState('');
	const { authToken, accountLogInType } = useAuth();
	const params = new URLSearchParams(window.location.search);
	const courseId = params.get('courseid');
	const [currentInstructor, setCurrentInstructor] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			checkAccess(accountLogInType, navigate, 'instructor', authToken);
			const courseData = await fetchCourseData(courseId, authToken);
			const filledEntries = fillEmptyItems(courseData.history, courseData.perPage);
			const termData = await fetchTermResponse();
			courseData.latestTerm = termData.currentTerm.toString();
			setTermString(getTermString(termData.currentTerm));
			setHistoryData({ ...courseData, history: filledEntries.filter((entry)=>entry.term_num < courseData.latestTerm) });
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
	const {
		historyData, setHistoryData,
		navigate,
		currentInstructor,
		termString, setTermString
	} = useCourseHistory();
	
	const pageCount = Math.ceil(historyData.entryCount / historyData.perPage);
	const currentEntries = currentItems(historyData.history, historyData.currentPage, historyData.perPage);
	console.log(currentEntries);
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
					<p>Current TA(s) ({termString}): </p>
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