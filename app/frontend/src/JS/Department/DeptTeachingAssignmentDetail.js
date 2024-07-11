import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, 
	handlePageClick, 
	pageCount, 
	currentItems,
	handleSearchChange,
  checkAccess,
  getDivisionName
} from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptTeachingAssignment.css';

function DeptTeachingAssignmentDetail() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { selectedDivision, courses, members } = location.state || {};
	const [deptCourseList, setDeptCourseList] = useState({
		courses: [],
		coursesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [search, setSearch] = useState('');

	useEffect(() => {
		if (courses && members) {
			const prefix = selectedDivision === 'computer-science' ? 'COSC' : selectedDivision.slice(0, 4).toUpperCase();
			const filteredCourses = courses.filter(course => course.courseCode.startsWith(prefix));
			
			// Add name from members to each course
			const coursesWithName = filteredCourses.map(course => {
				const member = members.find(member => member.id === course.instructorId);
				return {
					...course,
					name: member ? member.name : 'Unknown'
				};
			});

			const filledCourses = fillEmptyItems(coursesWithName, deptCourseList.perPage);

			setDeptCourseList({
				courses: filledCourses,
				coursesCount: filteredCourses.length,
				perPage: 10,
				currentPage: 1,
			});
		}
	}, [selectedDivision, courses, members]);

	return (
		<div className="dashboard" id="dept-course-list-test-content">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar searchListType={'DeptCourseList'} />

				<div className="main">
					<div className="subtitle-course">List of Courses ({getDivisionName(selectedDivision)})
						<button className='status-change-button'><Link to={`/DeptTeachingAssignment`}>Return</Link></button>
					</div>

					<div className="dcourse-table">
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Course</th>
									<th>Title</th>
								</tr>
							</thead>

							<tbody>
								{currentItems(deptCourseList.courses, deptCourseList.currentPage, deptCourseList.perPage).map((course) => (
									<tr key={course.id}>
										<td>{course.name}</td>
										<td>{course.courseCode}</td>
										<td>{course.title}</td>
									</tr>
								))}
							</tbody>

							<tfoot>
								<ReactPaginate
									previousLabel={'<'}
									nextLabel={'>'}
									breakLabel={'...'}
									pageCount={pageCount(deptCourseList.coursesCount, deptCourseList.perPage)}
									marginPagesDisplayed={3}
									pageRangeDisplayed={0}
									onPageChange={(data) => handlePageClick(data, setDeptCourseList)}
									containerClassName={'pagination'}
									activeClassName={'active'}
									forcePage={deptCourseList.currentPage - 1}
								/>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeptTeachingAssignmentDetail;
