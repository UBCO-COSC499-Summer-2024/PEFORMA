import React, { useState, useEffect } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Instructor/InsCourseHistory.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { getCurrentInstructor } from '../common/utils.js';

function CourseHistory() {
	const [historyData, setHistoryData] = useState({
		history: [{}],
		entryCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const navigate = useNavigate();
	const { authToken, accountLogInType } = useAuth();
	const params = new URLSearchParams(window.location.search);
	const courseId = params.get('courseid');
	const [currentInstructor, setCurrentInstructor] = useState([]);
	const [numInstructors, setNumInstructors] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			const numericAccountType = Number(accountLogInType);
			if (numericAccountType !== 3) {
				alert('No Access, Redirecting to department view');
				navigate('/DeptDashboard');
			}
			const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
				params: { courseId: courseId },
				headers: { Authorization: `Bearer ${authToken.token}` },
			});
			const data = res.data;
			const filledEntries = fillEmptyEntries(data.history, data.perPage);
			setHistoryData({ ...data, history: filledEntries });
			data.latestTerm = getCurrentTerm();
			setCurrentInstructor(data.history.filter((entry)=>entry.term_num == data.latestTerm));
			setNumInstructors(data.history.length);
		};
		fetchData();
	}, []);

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

	const handlePageClick = (data) => {
		setHistoryData((prevState) => ({
			...prevState,
			currentPage: data.selected + 1,
		}));
	};

	const pageCount = Math.ceil(historyData.entryCount / historyData.perPage);

	const currentEntries = historyData.history.slice(
		(historyData.currentPage - 1) * historyData.perPage,
		historyData.currentPage * historyData.perPage
	);
	let i = 0;
	return (
		<div className="dashboard coursehistory">
			<CreateSideBar sideBarType="Instructor" />
			<div className="container">
				<CreateTopBar />

				<div className="courseinfo-main">
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
								<Link to={"/InsProfilePage?profileid="+instructor.instructorID}><strong>{instructor.instructorName}</strong></Link>
								{index !== currentInstructor.length - 1 && (
									<span>, </span>
								)}
								</span>
								);
								
							})
						)}
							</p>
					</div>
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
								{currentEntries.map((entry) => {
									i++;

									return (
										<tr key={i}>
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

export default CourseHistory;