import React, { useState, useEffect } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Instructor/InsCourseHistory.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { checkAccess, getCurrentTerm, fillEmptyItems, handlePageClick, currentItems } from '../common/utils.js';

const fetchCourseData = async(courseId, authToken) => {
	const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
		params: { courseId: courseId },
		headers: { Authorization: `Bearer ${authToken.token}` },
	});
	return res.data;
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
	const { authToken, accountLogInType } = useAuth();
	const params = new URLSearchParams(window.location.search);
	const courseId = params.get('courseid');
	const [currentInstructor, setCurrentInstructor] = useState([]);
	const [numInstructors, setNumInstructors] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			checkAccess(accountLogInType, navigate, 'instructor', authToken);
			const courseData = await fetchCourseData(courseId, authToken);
			const filledEntries = fillEmptyItems(courseData.history, courseData.perPage);
			courseData.latestTerm = getCurrentTerm();
			setHistoryData({ ...courseData, history: filledEntries });
			setCurrentInstructor(courseData.history.filter((entry)=>entry.term_num == courseData.latestTerm));
			setNumInstructors(courseData.history.length);
		};
		fetchData();
	}, []);
	return {
		historyData, setHistoryData,
		navigate,
		currentInstructor,
		numInstructors
	}
}

function CourseHistory() {
	const {
		historyData, setHistoryData,
		navigate,
		currentInstructor,
		numInstructors
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
						<p>Current Instructor(s): {currentInstructor.length === 0 && (
							<strong>N/A</strong>
						)}
						{currentInstructor.length !== 0 && (
							currentInstructor.map((instructor, index) => {
								return (
								<span>
								<Link to={"/InsProfilePage?ubcid="+instructor.ubcid}><strong>{instructor.instructorName}</strong></Link>
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
						<p className="bold">Course History ({numInstructors} Entries)</p>
						<table id="historyTable">
							<thead>
								<tr>
									<th>Instructor</th>
									<th>Session</th>
									<th>Term</th>
								</tr>
							</thead>
							<tbody>
								{currentEntries.map((entry, index) => {
									return (
										<tr key={index}>
											<td>
												<Link to={`/InsProfilePage?ubcid=${entry.ubcid}`}>
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