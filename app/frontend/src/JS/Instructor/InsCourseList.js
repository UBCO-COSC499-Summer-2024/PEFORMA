import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../../CSS/Instructor/InsCourseList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import divisions from '../common/divisions.js';
import axios from 'axios';
import '../common/AuthContext.js';
import { useAuth } from '../common/AuthContext.js';

function InsCourseList() {
	const { authToken, accountLogInType } = useAuth();
	const params = new URLSearchParams(window.location.search);
	const divisionCode = params.get('division') || 'COSC';

	const navigate = useNavigate();
	const divisionHandler = (e) => {
		navigate('?division=' + e.target.value);
	};

	const [divisionData, setDivisionData] = useState({
		courses: [{}],
		divisionCoursesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [search, setSearch] = useState('');

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				if (!authToken) {
					// Redirect to login if no token
					navigate('/Login'); // Use your navigation mechanism
					return;
				}
				const numericAccountType = Number(accountLogInType);
				if (numericAccountType !== 3) {
					alert('No Access, Redirecting to department view');
					navigate('/DeptDashboard');
				}
				// Fetch course data with Axios, adding token to header
				const res = await axios.get(`http://localhost:3001/api/courses?division=${divisionCode}`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const data = res.data;
				console.log(data);
				const filledCourses = fillEmptyCourses(data.courses, data.perPage);
				setDivisionData({ ...data, courses: filledCourses });
			} catch (error) {
				// Handle 401 (Unauthorized) error and other errors
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken'); // Clear invalid token
					navigate('/Login');
				} else {
					console.error('Error fetching courses:', error);
				}
			}
		};
		fetchCourses();
	}, [authToken, divisionCode]);

	const handlePageClick = (data) => {
		setDivisionData((prevState) => ({
			...prevState,
			currentPage: data.selected + 1,
		}));
	};

	const handleSearchChange = (newSearch) => {
		setSearch(newSearch);
		setDivisionData((prevState) => ({ ...prevState, currentPage: 1 }));
	};

	const fillEmptyCourses = (courses, perPage) => {
		const filledCourses = [...courses];
		const currentCount = courses.length;
		const fillCount = perPage - (currentCount % perPage);
		if (fillCount < perPage) {
			for (let i = 0; i < fillCount; i++) {
				filledCourses.push({});
			}
		}
		return filledCourses;
	};

	const pageCount = Math.ceil(divisionData.divisionCoursesCount / divisionData.perPage);

	const filteredCourses = divisionData.courses.filter(
		(course) =>
			(course.id?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
			(course.title?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
			(course.instructor &&
				Array.isArray(course.instructor) &&
				course.instructor.some((instructor) =>
					instructor.toLowerCase().includes(search.toLowerCase())
				))
	);

	const currentCourses = filteredCourses.slice(
		(divisionData.currentPage - 1) * divisionData.perPage,
		divisionData.currentPage * divisionData.perPage
	);

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Instructor" />
			<div className="container">
				<CreateTopBar searchListType={'InsCourseList'} onSearch={handleSearchChange} />

				<div className="courselist-main">
					<header className="ListTitle" id="dropdown-test-content">
						<div className="ListTitle-text">List of Courses</div>
						<select name="divisionCode" defaultValue={divisionCode} onChange={divisionHandler}>
							{divisions.map((division) => {
								return (
									<option key={division.code} value={division.code}>
										{division.label}
									</option>
								);
							})}
						</select>
					</header>

					<div className="course-table" id="course-test-content">
						<table>
							<thead>
								<tr>
									<th>Course</th>
									<th>Title</th>
									<th>Instructor</th>
									<th>Email</th>
								</tr>
							</thead>

							<tbody>
								{currentCourses.map((course) => {
									return (
										<tr key={course.id}>
											<td>
												<Link to={`/InsCourseHistory?courseid=${course.id}`}>{course.id}</Link>
											</td>
											<td>{course.title}</td>
											<td>
												{course.instructor ? (
													Array.isArray(course.instructor) ? (
														course.instructor.map((instructor, index) => (
															<React.Fragment key={course.ubcid[index]}>
																<Link to={`/InsProfilePage?ubcid=${course.ubcid[index]}`}>
																	{instructor}
																</Link>
																{index < course.instructor.length - 1 ? (
																	<>
																		<br />
																		<br />
																	</>
																) : null}
															</React.Fragment>
														))
													) : (
														<Link to={`/InsProfilePage?ubcid=${course.ubcid}`}>
															{course.instructor}
														</Link>
													)
												) : (
													''
												)}
											</td>
											<td>
												{course.email
													? Array.isArray(course.email)
														? course.email.map((email, index) => (
																<React.Fragment key={index}>
																	{email}
																	{index < course.email.length - 1 ? (
																		<>
																			<br />
																			<br />
																		</>
																	) : null}
																</React.Fragment>
														  ))
														: course.email
													: ''}
											</td>
										</tr>
									);
								})}
							</tbody>

							<tfoot>
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
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InsCourseList;
