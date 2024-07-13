import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { fillEmptyItems, handlePageClick, handleSearchChange, pageCount, currentItems, checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptTeachingAssignment.css';

function DeptTeachingAssignmentDetail() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { selectedDivision, courses, professors } = location.state || {};
	const [courseList, setCourseList] = useState({
		courses: [],
		totalCoursesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [currentDivision, setCurrentDivision] = useState(selectedDivision);
	const [search, setSearch] = useState('');

	useEffect(() => {
		checkAccess(accountLogInType, navigate, 'department');
		if (courses && professors) {
			const prefix = currentDivision === 'computer-science' ? 'COSC' : currentDivision.slice(0, 4).toUpperCase();
			const filteredCourses = courses.filter(course => course.courseCode && course.courseCode.startsWith(prefix));

			const filledCourses = fillEmptyItems(filteredCourses, courseList.perPage);

			setCourseList({
				courses: filledCourses,
				totalCoursesCount: filteredCourses.length,
				perPage: 10,
				currentPage: 1,
			});
		}
	}, [currentDivision, courses, professors, courseList.perPage]);

	const filteredCourses = courseList.courses.filter(
    (course) =>
        (course.instructor?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        (course.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        (course.courseName?.toLowerCase() ?? '').includes(search.toLowerCase())
);

	const currentCourses = currentItems(filteredCourses, courseList.currentPage, courseList.perPage);

	const handleDivisionChange = (event) => {
		setCurrentDivision(event.target.value);
	};

	return (
		<div className="dashboard" id="dept-course-list-test-content">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar searchListType={'DeptTeachingAssignmentDetail'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setCourseList);}} />

				<div className="srlist-main">
					<div className="subtitle-course">
						<div className='divison-select-subtitle'>
							List of Courses 
							<select className='detail-division-select' onChange={handleDivisionChange} value={currentDivision}>
								<option value="computer-science">Computer Science</option>
								<option value="mathematics">Mathematics</option>
								<option value="physics">Physics</option>
								<option value="statistics">Statistics</option>
							</select>
						</div>
						<button className='status-change-button'>
							<Link to={`/DeptTeachingAssignment`}>Return</Link>
						</button>
					</div>


					<div className="detail-course-table">
						<table>
							<thead>
								<tr>
									<th>Instructor</th>
									<th>Course Code</th>
									<th>Course Name</th>
									<th>Email</th>
								</tr>
							</thead>

							<tbody>
								{currentCourses.map((course) => (
									<tr key={course.id}>
										<td><Link to={`http://localhost:3000/DeptProfilePage?ubcid=${course.ubcid}`}>{course.instructor}</Link></td>
										<td><Link to={`http://localhost:3000/DeptCourseInformation?courseid=${course.id}`}>{course.courseCode}</Link></td>
										<td>{course.courseName}</td>
										<td>{course.email}</td>
									</tr>
								))}
							</tbody>

							<tfoot>
								<ReactPaginate
									previousLabel={'<'}
									nextLabel={'>'}
									breakLabel={'...'}
									pageCount={pageCount(courseList.totalCoursesCount, courseList.perPage)}
									marginPagesDisplayed={3}
									pageRangeDisplayed={2}
									onPageChange={(data) => handlePageClick(data, setCourseList)}
									containerClassName={'pagination'}
									activeClassName={'active'}
									forcePage={courseList.currentPage - 1}
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
