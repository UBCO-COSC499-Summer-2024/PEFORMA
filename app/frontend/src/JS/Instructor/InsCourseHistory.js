import React, { useState, useEffect } from 'react';
import CreateSidebar from '../common/commonImports.js';
import { CreateTopbar } from '../common/commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/CourseInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';

function CourseHistory() {
	const [historyData, setHistoryData] = useState({
		history: [{}],
		entryCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const navigate = useNavigate();
	const { authToken, accountType } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			const numericAccountType = Number(accountType);
			if (numericAccountType !== 3) {
				alert('No Access, Redirecting to department view');
				navigate('/DeptDashboard');
			}
			const url = 'http://localhost:3000/courseHistory.json';
			const res = await axios.get(url);
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
			<CreateSidebar />
			<div className="container">
				<CreateTopbar />

				<div className="main">
					<Link to="/CourseList">&lt; Back to All Courses</Link>
					<h1 className="courseName" role="contentinfo">
						{historyData.courseCode}: {historyData.courseName}
					</h1>
					<p role="contentinfo">{historyData.courseDescription}</p>

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
								{currentEntries.map((entry) => {
									i++;

									return (
										<tr key={i}>
											<td>
												<Link to={`/DepartmentProfilePage?ubcid=${entry.instructorID}`}>
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
