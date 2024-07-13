import React, { useState, useEffect } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptCourseInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';

function CourseInformation() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const courseId = params.get('courseid');
	const [historyData, setHistoryData] = useState({
		history: [{}],
		entryCount: 0,
		perPage: 10,
		currentPage: 1,
	});

	useEffect(() => {
		console.log('Use effect executing');
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
			console.log('Before fetch');
			const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
				params: { courseId: courseId },
				headers: { Authorization: `Bearer ${authToken.token}` },
			});
			console.log('After res');
			const data = res.data;
			const filledEntries = fillEmptyEntries(data.history, data.perPage);
			setHistoryData({ ...data, history: filledEntries });
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

	function showHistory(historyData, offset) {
		if (historyData.assigneeCount > historyData.perPage) {
			return historyData.history.slice(offset, offset + historyData.perPage);
		}
		return historyData.assignees;
	}

	const handlePageClick = (data) => {
		setHistoryData((prevState) => ({
			...prevState,
			currentPage: data.selected + 1,
		}));
	};

	const pageCount = Math.ceil(historyData.entryCount / historyData.perPage);
	const offset = (historyData.currentPage - 1) * historyData.perPage;

	const currentEntries = historyData.history.slice(
		(historyData.currentPage - 1) * historyData.perPage,
		historyData.currentPage * historyData.perPage
	);
	let i = 0;
	return (
		<div className="dashboard coursehistory">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />

				<div className="courseinfo-main">
					<button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
					<h1 className="courseName" role="contentinfo">
						{historyData.courseCode}: {historyData.courseName}
					</h1>
					<p role="contentinfo">{historyData.courseDescription}</p>
					<div className="bold score">
						Average Performance Score: <span role="contentinfo">{historyData.avgScore}</span>
					</div>
					<div className="buttons">
						<button id="edit" role="button" name="edit">
							Edit Course
						</button>
						<button id="deactivate" role="button" name="deactivate">
							Deactivate
						</button>
					</div>
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
								{currentEntries.map((entry) => {
									i++;

									return (
										<tr key={i}>
											<td>
												<Link to={`/DeptProfilePage?ubcid=${entry.instructorID}`}>
													{entry.instructorName}
												</Link>
											</td>
											<td>{entry.session}</td>
											<td>{entry.term}</td>
											<td>{entry.score}</td>
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

export default CourseInformation;
